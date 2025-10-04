// js/login.js
// Firebase-enabled login modal (phone + OTP).
// Exposes: LoginModal.show(callback)
// If firebase-config.js is present and valid, uses Firebase Phone Auth (real SMS).
// Otherwise falls back to a simulated OTP (console) for local dev.
//
// This version initializes the invisible reCAPTCHA when the modal opens
// to avoid race/visibility problems.

(function (window, document) {
  function $(id) { return document.getElementById(id); }

  // Detect firebase config and compat SDK presence
  let firebaseAuth = null;
  let useFirebase = false;
  try {
    if (window.__FIREBASE_CONFIG && typeof window.__FIREBASE_CONFIG === 'object' && window.firebase && window.firebase.auth) {
      firebaseAuth = window.firebase.auth();
      useFirebase = true;
      console.log('login.js: Firebase detected - using real phone auth.');
    } else {
      useFirebase = false;
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
    if (!modal) { console.warn('Login modal markup not found'); return; }
    modal.style.display = 'flex';
    // reset UI
    $('login-step-phone').style.display = '';
    $('login-step-otp').style.display = 'none';
    $('login-error').style.display = 'none';
    $('login-success').style.display = 'none';
    $('login-phone').value = '';
    $('login-otp').value = '';

    // If using Firebase, ensure recaptchaVerifier exists (create if missing)
    if (useFirebase) {
      try {
        // create only once
        if (!window.recaptchaVerifier || typeof window.recaptchaVerifier.render !== 'function') {
          // Ensure the recaptcha container exists
          const rc = $('recaptcha-container');
          if (!rc) {
            console.error('recaptcha container #recaptcha-container not found in DOM.');
            showError('Internal error: reCAPTCHA not found. Reload the page.');
            return;
          }

          // Create invisible reCAPTCHA
          window.recaptchaVerifier = new window.firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'badge': 'bottomright'
          }, firebaseAuth);

          // Render to initialize; this returns a promise
          window.recaptchaVerifier.render()
            .then(function(widgetId) {
              window.__recaptchaWidgetId = widgetId;
              console.log('reCAPTCHA rendered, widgetId=', widgetId);
            })
            .catch(function(err) {
              console.error('reCAPTCHA render failed', err);
              showError('reCAPTCHA initialization failed. Check console for details.');
            });
        } else {
          console.log('reCAPTCHA already initialized.');
        }
      } catch (err) {
        console.error('Error creating reCAPTCHA', err);
        showError('Could not initialize reCAPTCHA. Check console.');
      }
    }
  }

  function hideModal() {
    const modal = $('simple-login-modal');
    if (modal) modal.style.display = 'none';
  }

  // Simulated OTP for dev fallback
  function sendSimulatedOtp(phone) {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    try { sessionStorage.setItem('__sim_otp', otp); } catch (e) {}
    console.log('Simulated OTP for', phone, 'is', otp);
  }

  // Use firebase to send OTP (uses window.recaptchaVerifier)
  function sendFirebaseOtp(phone) {
    return new Promise((resolve, reject) => {
      if (!firebaseAuth) return reject(new Error('Firebase not initialized.'));
      if (!window.recaptchaVerifier) return reject(new Error('reCAPTCHA not initialized.'));
      firebaseAuth.signInWithPhoneNumber('+' + phone, window.recaptchaVerifier)
        .then(function (confirmationResult) {
          window.__firebaseConfirmation = confirmationResult;
          console.log('Firebase signInWithPhoneNumber success, confirmation stored.');
          resolve(confirmationResult);
        })
        .catch(function (err) {
          console.error('signInWithPhoneNumber failed', err);
          // reset recaptcha so user may try again
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
      if (!confirmationResult) return reject(new Error('No confirmation result found'));
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
      sendBtn.onclick = function () {
        clearError();
        const phoneRaw = $('login-phone').value.trim();
        if (!/^\d{10}$/.test(phoneRaw)) {
          showError('Please enter a valid 10-digit mobile number.');
          return;
        }
        const phone = '91' + phoneRaw;

        // If using Firebase, attempt real flow
        if (useFirebase) {
          sendBtn.disabled = true;
          sendBtn.textContent = 'Sending...';
          sendFirebaseOtp(phone)
            .then(() => {
              $('login-step-phone').style.display = 'none';
              $('login-step-otp').style.display = '';
            })
            .catch((err) => {
              // On error, show message and fallback to simulated flow optionally
              console.error('sendFirebaseOtp error:', err);
              if (err && err.code) {
                // show friendly message for common codes
                if (err.code === 'auth/invalid-phone-number') showError('Invalid phone number format.');
                else if (err.code === 'auth/unauthorized-domain') showError('Domain not authorized in Firebase Auth settings.');
                else if (err.code === 'auth/too-many-requests') showError('Too many requests. Try again later.');
                else showError('Failed to send OTP: ' + (err.message || err.code));
              } else {
                showError('Failed to send OTP. Check console for details.');
              }
            })
            .finally(() => {
              sendBtn.disabled = false;
              sendBtn.textContent = 'Send OTP';
            });
        } else {
          // fallback: simulated OTP
          sendSimulatedOtp(phone);
          $('login-step-phone').style.display = 'none';
          $('login-step-otp').style.display = '';
        }
      };
    }

    const verifyBtn = $('verify-otp-btn');
    if (verifyBtn) {
      verifyBtn.onclick = function () {
        clearError();
        const entered = $('login-otp').value.trim();
        if (!entered) {
          showError('Please enter the OTP.');
          return;
        }

        if (useFirebase) {
          verifyBtn.disabled = true;
          verifyBtn.textContent = 'Verifying...';
          confirmFirebaseOtp(entered)
            .then((user) => {
              try { sessionStorage.setItem('isVerified', '1'); } catch (e) {}
              $('login-success').textContent = 'Verified! You will now see the price.';
              $('login-success').style.display = 'block';
              setTimeout(function () {
                hideModal();
                if (LoginModal._onVerified && typeof LoginModal._onVerified === 'function') {
                  const cb = LoginModal._onVerified;
                  LoginModal._onVerified = null;
                  cb();
                }
              }, 400);
            })
            .catch((err) => {
              console.error('confirmFirebaseOtp error', err);
              showError('Invalid OTP or expired. Please try again.');
            })
            .finally(() => {
              verifyBtn.disabled = false;
              verifyBtn.textContent = 'Verify';
            });
        } else {
          const otp = sessionStorage.getItem('__sim_otp') || '';
          if (entered === otp) {
            try { sessionStorage.setItem('isVerified', '1'); } catch (e) {}
            $('login-success').textContent = 'Verified! You will now see the price.';
            $('login-success').style.display = 'block';
            setTimeout(function () {
              hideModal();
              if (LoginModal._onVerified && typeof LoginModal._onVerified === 'function') {
                const cb = LoginModal._onVerified;
                LoginModal._onVerified = null;
                cb();
              }
            }, 400);
          } else {
            showError('Invalid OTP. Check the console for the test OTP (dev mode).');
          }
        }
      };
    }

    const modal = $('simple-login-modal');
    if (modal) {
      modal.onclick = function (e) {
        if (e.target === modal) hideModal();
      };
    }
  }

  // Public API
  const LoginModal = {
    show: function (onVerified) {
      LoginModal._onVerified = onVerified || null;
      showModal();
    },
    hide: hideModal,
    _onVerified: null
  };

  document.addEventListener('DOMContentLoaded', function () {
    bindUI();
  });

  window.LoginModal = LoginModal;
})(window, document);
