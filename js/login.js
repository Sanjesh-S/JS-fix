// js/login.js - FIXED VERSION
// Wrapped in DOMContentLoaded to prevent race condition

document.addEventListener('DOMContentLoaded', function() {
  (function (window, document) {
    function $(id) { return document.getElementById(id); }

    let firebaseAuth = null;
    let useFirebase = false;

    // Detect firebase config and compat SDK presence
    try {
      if (window.__FIREBASE_DISABLED) {
        console.warn('login.js: Firebase disabled due to init error - using simulated OTP');
        useFirebase = false;
      } else if (window.__FIREBASE_CONFIG && typeof window.__FIREBASE_CONFIG === 'object' && window.firebase && window.firebase.auth) {
        firebaseAuth = window.firebase.auth();
        useFirebase = true;
        console.log('login.js: Firebase detected - using real phone auth.');
      } else {
        useFirebase = false;
        console.log('login.js: Firebase not available - using simulated OTP');
      }
    } catch (err) {
      console.warn('login.js: firebase init check failed', err);
      useFirebase = false;
    }

    // UI helpers
    function showError(msg) {
      const el = $('login-error');
      if (!el) return;
      el.textContent = msg;
      el.style.display = 'block';
    }

    function clearError() {
      const el = $('login-error');
      if (!el) return;
      el.style.display = 'none';
    }

    function showModal() {
      const modal = $('simple-login-modal');
      if (!modal) {
        console.warn('Login modal markup not found');
        return;
      }
      modal.style.display = 'flex';
      
      // Reset UI
      $('login-step-phone').style.display = '';
      $('login-step-otp').style.display = 'none';
      $('login-error').style.display = 'none';
      $('login-success').style.display = 'none';
      $('login-phone').value = '';
      $('login-otp').value = '';

      // Only initialize reCAPTCHA if using Firebase
      if (useFirebase) {
        initializeRecaptcha();
      }
    }

    function hideModal() {
      const modal = $('simple-login-modal');
      if (modal) modal.style.display = 'none';
    }

    // Initialize reCAPTCHA (only when modal opens)
    function initializeRecaptcha() {
      try {
        // Skip if already initialized
        if (window.recaptchaVerifier && typeof window.recaptchaVerifier.render === 'function') {
          console.log('reCAPTCHA already initialized.');
          return;
        }

        const rc = $('recaptcha-container');
        if (!rc) {
          console.error('recaptcha container #recaptcha-container not found in DOM.');
          showError('Internal error: reCAPTCHA not found. Using test mode instead.');
          useFirebase = false; // Fallback to simulated
          return;
        }

        // Create invisible reCAPTCHA
        window.recaptchaVerifier = new window.firebase.auth.RecaptchaVerifier('recaptcha-container', {
          'size': 'invisible',
          'badge': 'bottomright',
          'callback': function(response) {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': function() {
            console.warn('reCAPTCHA expired');
            showError('reCAPTCHA expired. Please try again.');
          }
        }, firebaseAuth);

        // Render to initialize
        window.recaptchaVerifier.render()
          .then(function(widgetId) {
            window.__recaptchaWidgetId = widgetId;
            console.log('reCAPTCHA rendered, widgetId=', widgetId);
          })
          .catch(function(err) {
            console.error('reCAPTCHA render failed:', err.code, err.message);
            
            // Check for specific error codes
            if (err.code === 'auth/invalid-api-key') {
              showError('Firebase API key is invalid. Using test mode instead.');
            } else if (err.code === 'auth/unauthorized-domain') {
              showError('Domain not authorized. Using test mode instead.');
            } else {
              showError('reCAPTCHA initialization failed. Using test mode instead.');
            }
            
            // Fallback to simulated OTP
            useFirebase = false;
          });
      } catch (err) {
        console.error('Error creating reCAPTCHA:', err);
        showError('Could not initialize reCAPTCHA. Using test mode instead.');
        useFirebase = false;
      }
    }

    // Simulated OTP for dev fallback
    function sendSimulatedOtp(phone) {
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      try {
        sessionStorage.setItem('__sim_otp', otp);
      } catch (e) {}
      console.log('%c═══════════════════════════════════', 'color: #00a8ff; font-weight: bold');
      console.log('%c🔐 TEST MODE - SIMULATED OTP', 'color: #00a8ff; font-size: 16px; font-weight: bold');
      console.log('%c═══════════════════════════════════', 'color: #00a8ff; font-weight: bold');
      console.log('%cPhone:', 'color: #888', phone);
      console.log('%cOTP Code:', 'color: #4cd137; font-size: 20px; font-weight: bold', otp);
      console.log('%c═══════════════════════════════════', 'color: #00a8ff; font-weight: bold');
    }

    // Use firebase to send OTP
    function sendFirebaseOtp(phone) {
      return new Promise((resolve, reject) => {
        if (!firebaseAuth) {
          return reject(new Error('Firebase not initialized.'));
        }
        if (!window.recaptchaVerifier) {
          return reject(new Error('reCAPTCHA not initialized.'));
        }

        firebaseAuth.signInWithPhoneNumber('+' + phone, window.recaptchaVerifier)
          .then(function(confirmationResult) {
            window.__firebaseConfirmation = confirmationResult;
            console.log('Firebase signInWithPhoneNumber success');
            resolve(confirmationResult);
          })
          .catch(function(err) {
            console.error('signInWithPhoneNumber failed:', err.code, err.message);
            
            // Reset recaptcha
            try {
              if (window.recaptchaVerifier && window.recaptchaVerifier.clear) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
              }
            } catch (e) {}
            
            reject(err);
          });
      });
    }

    function confirmFirebaseOtp(code) {
      return new Promise((resolve, reject) => {
        const confirmationResult = window.__firebaseConfirmation;
        if (!confirmationResult) {
          return reject(new Error('No confirmation result found'));
        }
        confirmationResult.confirm(code)
          .then((result) => resolve(result.user))
          .catch((err) => reject(err));
      });
    }

    // UI event binding
    function bindUI() {
      const closeBtn = $('login-modal-close');
      if (closeBtn) closeBtn.onclick = hideModal;

      const sendBtn = $('send-otp-btn');
      if (sendBtn) {
        sendBtn.onclick = function() {
          clearError();
          const phoneRaw = $('login-phone').value.trim();
          
          if (!/^\d{10}$/.test(phoneRaw)) {
            showError('Please enter a valid 10-digit mobile number.');
            return;
          }
          
          const phone = '91' + phoneRaw;

          // Show mode info
          if (useFirebase) {
            console.log('Using REAL Firebase phone auth');
          } else {
            console.log('Using SIMULATED OTP (test mode)');
          }

          // Try Firebase first if available
          if (useFirebase) {
            sendBtn.disabled = true;
            sendBtn.textContent = 'Sending...';
            
            sendFirebaseOtp(phone)
              .then(() => {
                $('login-step-phone').style.display = 'none';
                $('login-step-otp').style.display = '';
              })
              .catch((err) => {
                console.error('Firebase OTP error:', err);
                
                // Show user-friendly error and fallback to simulated
                if (err.code === 'auth/invalid-phone-number') {
                  showError('Invalid phone format. Using test mode instead.');
                } else if (err.code === 'auth/too-many-requests') {
                  showError('Too many requests. Using test mode instead.');
                } else {
                  showError('SMS service unavailable. Using test mode instead.');
                }
                
                // Fallback to simulated
                useFirebase = false;
                setTimeout(() => {
                  clearError();
                  sendSimulatedOtp(phone);
                  $('login-step-phone').style.display = 'none';
                  $('login-step-otp').style.display = '';
                }, 1500);
              })
              .finally(() => {
                sendBtn.disabled = false;
                sendBtn.textContent = 'Send OTP';
              });
          } else {
            // Use simulated OTP
            sendSimulatedOtp(phone);
            $('login-step-phone').style.display = 'none';
            $('login-step-otp').style.display = '';
          }
        };
      }

      const verifyBtn = $('verify-otp-btn');
      if (verifyBtn) {
        verifyBtn.onclick = function() {
          clearError();
          const entered = $('login-otp').value.trim();
          
          if (!entered) {
            showError('Please enter the OTP.');
            return;
          }

          if (useFirebase && window.__firebaseConfirmation) {
            verifyBtn.disabled = true;
            verifyBtn.textContent = 'Verifying...';
            
            confirmFirebaseOtp(entered)
              .then((user) => {
                handleSuccessfulVerification();
              })
              .catch((err) => {
                console.error('Firebase OTP verification failed:', err);
                showError('Invalid OTP. Please try again.');
              })
              .finally(() => {
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Verify';
              });
          } else {
            // Simulated verification
            const otp = sessionStorage.getItem('__sim_otp') || '';
            if (entered === otp) {
              handleSuccessfulVerification();
            } else {
              showError('Invalid OTP. Check the console for the test OTP.');
            }
          }
        };
      }

      const modal = $('simple-login-modal');
      if (modal) {
        modal.onclick = function(e) {
          if (e.target === modal) hideModal();
        };
      }
    }

    function handleSuccessfulVerification() {
      try {
        sessionStorage.setItem('isVerified', '1');
      } catch (e) {}
      
      $('login-success').textContent = 'Verified! You will now see the price.';
      $('login-success').style.display = 'block';
      
      setTimeout(function() {
        hideModal();
        if (LoginModal._onVerified && typeof LoginModal._onVerified === 'function') {
          const cb = LoginModal._onVerified;
          LoginModal._onVerified = null;
          cb();
        }
      }, 800);
    }

    // Public API
    const LoginModal = {
      show: function(onVerified) {
        LoginModal._onVerified = onVerified || null;
        showModal();
      },
      hide: hideModal,
      _onVerified: null
    };

    // This was missing before
    bindUI();

    window.LoginModal = LoginModal;
  })(window, document);
});