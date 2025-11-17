// ===== Global Firebase OTP Verification Flow (with Wallet & Logout) =====

(function() {
  
  let modal, closeModal, phoneInput, otpInput, sendOtpBtn, verifyOtpBtn, phoneStep, otpStep, errorBox, successBox, globalLoginBtn, walletBalanceEl, loginBtnSpan;

  /**
   * Fetches user data from Firestore, creates a new user if one doesn't exist,
   * and updates the header UI with coin balance and account status.
   */
  async function updateUserUI(user) {
    // Get header elements
    if (!globalLoginBtn) globalLoginBtn = document.getElementById("globalLoginBtn");
    if (!walletBalanceEl) walletBalanceEl = document.getElementById("walletCoinBalance");
    if (!loginBtnSpan) loginBtnSpan = globalLoginBtn?.querySelector('span');

    if (!user) { // User is logged out
      if (loginBtnSpan) loginBtnSpan.textContent = "Login";
      if (walletBalanceEl) walletBalanceEl.textContent = "0";
      if (globalLoginBtn) globalLoginBtn.href = "login.html"; // Set link to login page
      return;
    }
    
    // User is logged in
    if (globalLoginBtn) globalLoginBtn.href = "account.html"; // Set link to account page
    if (!firebase.firestore) return; // Exit if firestore is not loaded

    try {
      const db = firebase.firestore();
      const userRef = db.collection('users').doc(user.uid);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        if (walletBalanceEl) walletBalanceEl.textContent = userData.coins || 0;
        if (loginBtnSpan) loginBtnSpan.textContent = "My Account";
      } else {
        const newUser = {
          phoneNumber: user.phoneNumber,
          coins: 0,
          createdAt: new Date().toISOString()
        };
        await userRef.set(newUser);
        if (walletBalanceEl) walletBalanceEl.textContent = 0;
        if (loginBtnSpan) loginBtnSpan.textContent = "My Account";
      }
    } catch (e) {
      console.error("Error fetching/creating user data:", e);
      if (loginBtnSpan) loginBtnSpan.textContent = "Error";
      if (walletBalanceEl) walletBalanceEl.textContent = "!";
    }
  }

  // --- NEW: Handle Logout (defined outside) ---
  
  
  /**
   * Finds all DOM elements and attaches listeners.
   */
  function setupLoginModal() {
    // Find all elements
    globalLoginBtn = document.getElementById("globalLoginBtn");
    modal = document.getElementById("simple-login-modal"); // This is the OLD modal
    closeModal = document.getElementById("login-modal-close");
    phoneInput = document.getElementById("login-phone");
    otpInput = document.getElementById("login-otp");
    sendOtpBtn = document.getElementById("send-otp-btn");
    verifyOtpBtn = document.getElementById("verify-otp-btn");
    phoneStep = document.getElementById("login-step-phone");
    otpStep = document.getElementById("login-step-otp");
    errorBox = document.getElementById("login-error");
    successBox = document.getElementById("login-success");
    walletBalanceEl = document.getElementById("walletCoinBalance");
    loginBtnSpan = globalLoginBtn?.querySelector('span');
    
    // --- This is the function for the OLD modal on summary.html etc. ---
    function showOldLoginModal(e) {
      if (e) e.preventDefault();
      // If modal elements are on the current page, show the modal
      if (modal && errorBox && successBox) {
        modal.style.display = "flex";
        errorBox.style.display = "none";
        successBox.style.display = "none";
        
        // Initialize reCAPTCHA for the modal
        if (!window.recaptchaVerifier) {
          let recaptchaContainer = document.getElementById('recaptcha-container');
          if (!recaptchaContainer) {
            recaptchaContainer = document.createElement('div');
            recaptchaContainer.id = 'recaptcha-container';
            document.body.appendChild(recaptchaContainer);
          }
    
          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            size: 'invisible',
            callback: function(response) { console.log("reCAPTCHA verified"); }
          });
        }
      } else {
        // If no modal on this page, redirect to the login page
        window.location.href = 'login.html';
      }
    }
    
    // --- Initialize reCAPTCHA if on a page that has it ---
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer) {
      // This is for login.html OR the old modal
      try {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          'size': 'invisible',
          'callback': (response) => {
            console.log("reCAPTCHA verified, now sending OTP.");
          }
        });
        // Render it (it's invisible, but this prepares it)
        window.recaptchaVerifier.render().then((widgetId) => {
          window.recaptchaWidgetId = widgetId;
          console.log("reCAPTCHA rendered.");
        });
      } catch (e) {
        console.error("reCAPTCHA Error:", e);
        if (errorBox) {
            errorBox.textContent = "Could not load reCAPTCHA. Please check your network or refresh.";
            errorBox.style.display = "block";
        }
      }
    }

    // --- Smart Login/Logout Button ---
    

    // Close modal
    closeModal?.addEventListener("click", () => {
      modal.style.display = "none";
      if (phoneInput) phoneInput.value = "";
      if (otpInput) otpInput.value = "";
      if (phoneStep) phoneStep.style.display = "block";
      if (otpStep) otpStep.style.display = "none";
    });

    // Send OTP
    sendOtpBtn?.addEventListener("click", () => {
      const number = phoneInput.value.trim();

      if (number.length !== 10) {
        errorBox.textContent = "Please enter a valid 10-digit number.";
        errorBox.style.display = "block";
        return;
      }

      const fullPhone = "+91" + number;
      
      // --- FIXED: Ensure appVerifier exists ---
      if (!window.recaptchaVerifier) {
          errorBox.textContent = "reCAPTCHA not loaded. Please refresh.";
          errorBox.style.display = "block";
          return;
      }
      const appVerifier = window.recaptchaVerifier;
      // --- End of Fix ---

      sendOtpBtn.disabled = true;
      sendOtpBtn.textContent = "Sending...";
      errorBox.style.display = "none";

      firebase.auth().signInWithPhoneNumber(fullPhone, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          if (phoneStep) phoneStep.style.display = "none";
          if (otpStep) otpStep.style.display = "block";
          if (errorBox) errorBox.style.display = "none";
          alert("OTP sent successfully!");
        })
        .catch((error) => {
          console.error("Error sending OTP:", error);
          if (errorBox) {
            errorBox.textContent = "Error: " + error.message;
            errorBox.style.display = "block";
          }
          // Reset reCAPTCHA if it fails
          if (window.recaptchaVerifier) {
             window.recaptchaVerifier.render().catch(err => console.error("Recaptcha reset error", err));
          }
        })
        .finally(() => {
            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent = "Send OTP";
        });
    });

    // Verify OTP
    verifyOtpBtn?.addEventListener("click", () => {
      const code = otpInput.value.trim();

      if (code.length !== 6) {
        errorBox.textContent = "Please enter a valid 6-digit OTP.";
        errorBox.style.display = "block";
        return;
      }
      
      verifyOtpBtn.disabled = true;
      verifyOtpBtn.textContent = "Verifying...";
      errorBox.style.display = "none";
      
      if (!window.confirmationResult) {
          errorBox.textContent = "Please send an OTP first.";
          errorBox.style.display = "block";
          verifyOtpBtn.disabled = false;
          verifyOtpBtn.textContent = "Verify & Login";
          return;
      }

      window.confirmationResult.confirm(code)
        .then((result) => {
          const user = result.user;
          console.log("Verified:", user.phoneNumber);
          
          try { sessionStorage.setItem('isVerified', '1'); } catch (e) {}

          successBox.textContent = "✅ Phone verified successfully!";
          successBox.style.display = "block";

          // --- Update UI with user data ---
          updateUserUI(user);
          
          setTimeout(() => {
            // If on the login page, redirect to home. Otherwise, just close modal.
            if (window.location.pathname.endsWith('/login.html')) {
              window.location.href = 'index.html';
            } else if (modal) {
              modal.style.display = "none";
              phoneStep.style.display = "block";
              otpStep.style.display = "none";
              otpInput.value = "";
              phoneInput.value = "";
            }
          }, 1500);
          
          if (typeof window.onLoginVerified === 'function') {
            window.onLoginVerified();
          }

        })
        .catch((error) => {
          console.error("Verification failed:", error);
          errorBox.textContent = "Invalid OTP. Please try again.";
          errorBox.style.display = "block";
        })
        .finally(() => {
            verifyOtpBtn.disabled = false;
            verifyOtpBtn.textContent = "Verify & Login";
        });
    });
    
    // --- Check auth state on page load ---
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("User is already logged in:", user.phoneNumber);
        try { sessionStorage.setItem('isVerified', '1'); } catch (e) {}
        updateUserUI(user);

      } else {
        console.log("User is not logged in.");
        try { sessionStorage.removeItem('isVerified'); } catch (e) {}
        // --- Reset UI on logout ---
        updateUserUI(null);
      }
    });
    
    // Expose the showLoginModal function globally (for the old modal)
    window.LoginModal = {
      show: showOldLoginModal
    };

  } // end setupLoginModal
  
  // Run setup *after* the header is loaded
  // This waits for the 'headerLoaded' event we created in js/header.js
  document.addEventListener("headerLoaded", setupLoginModal);

})(); // <-- This is the closing brace for the IIFE