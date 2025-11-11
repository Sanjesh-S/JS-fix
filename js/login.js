// ===== Global Firebase OTP Verification Flow (with Wallet & Logout) =====

(function() {
  
  let modal, closeModal, phoneInput, otpInput, sendOtpBtn, verifyOtpBtn, phoneStep, otpStep, errorBox, successBox, globalLoginBtn, walletBalanceEl, loginBtnSpan;

  /**
   * Fetches user data from Firestore, creates a new user if one doesn't exist,
   * and updates the header UI with coin balance and account status.
   */
  async function updateUserUI(user) {
    if (!user) { // User is logged out
      if (loginBtnSpan) loginBtnSpan.textContent = "Login";
      if (walletBalanceEl) walletBalanceEl.textContent = "0";
      return;
    }
    
    // User is logged in
    if (!firebase.firestore) return; // Exit if firestore is not loaded

    // Get header elements
    if (!globalLoginBtn) globalLoginBtn = document.getElementById("globalLoginBtn");
    if (!walletBalanceEl) walletBalanceEl = document.getElementById("walletCoinBalance");
    if (!loginBtnSpan) loginBtnSpan = globalLoginBtn?.querySelector('span');

    try {
      const db = firebase.firestore();
      const userRef = db.collection('users').doc(user.uid);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        // User exists, get their data
        const userData = userDoc.data();
        if (walletBalanceEl) walletBalanceEl.textContent = userData.coins || 0;
        if (loginBtnSpan) loginBtnSpan.textContent = "My Account";

      } else {
        // New user, create their document
        const newUser = {
          phoneNumber: user.phoneNumber,
          coins: 0,
          createdAt: new Date().toISOString()
        };
        await userRef.set(newUser);
        
        // Set UI for new user
        if (walletBalanceEl) walletBalanceEl.textContent = 0;
        if (loginBtnSpan) loginBtnSpan.textContent = "My Account";
      }

    } catch (e) {
      console.error("Error fetching/creating user data:", e);
      if (loginBtnSpan) loginBtnSpan.textContent = "Error";
      if (walletBalanceEl) walletBalanceEl.textContent = "!";
    }
  }

  /**
   * Shows the login modal.
   */
  function showLoginModal(e) {
    if (e) e.preventDefault();
    if (!modal) return; 
    
    modal.style.display = "flex";
    errorBox.style.display = "none";
    successBox.style.display = "none";

    // Initialize reCAPTCHA
    if (!window.recaptchaVerifier) {
      let recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        recaptchaContainer = document.createElement('div');
        recaptchaContainer.id = 'recaptcha-container';
        document.body.appendChild(recaptchaContainer);
      }

      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: function(response) {
          console.log("reCAPTCHA verified");
        }
      });
    }
  }
  
  // --- NEW: Handle Logout ---
  function handleLogout() {
    if (confirm("Are you sure you want to log out?")) {
      firebase.auth().signOut().then(() => {
        console.log("User logged out.");
        // The onAuthStateChanged listener will automatically update the UI
      }).catch((error) => {
        console.error("Error logging out:", error);
      });
    }
  }

  /**
   * Finds all DOM elements and attaches listeners.
   */
  function setupLoginModal() {
    // Find all elements
    globalLoginBtn = document.getElementById("globalLoginBtn");
    modal = document.getElementById("simple-login-modal");
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

    // --- MODIFIED: Smart Login/Logout Button ---
    globalLoginBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      const user = firebase.auth().currentUser;
      if (user) {
        // If user is logged IN, clicking the button will log them out
        handleLogout();
      } else {
        // If user is logged OUT, clicking the button shows the login modal
        showLoginModal();
      }
    });
    // --- End of Modification ---

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
      const appVerifier = window.recaptchaVerifier;

      sendOtpBtn.disabled = true;
      sendOtpBtn.textContent = "Sending...";
      errorBox.style.display = "none";

      firebase.auth().signInWithPhoneNumber(fullPhone, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          phoneStep.style.display = "none";
          otpStep.style.display = "block";
          errorBox.style.display = "none";
          alert("OTP sent successfully!");
        })
        .catch((error) => {
          console.error("Error sending OTP:", error);
          errorBox.textContent = "Error: " + error.message;
          errorBox.style.display = "block";
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

      window.confirmationResult.confirm(code)
        .then((result) => {
          const user = result.user;
          console.log("Verified:", user.phoneNumber);
          
          try { sessionStorage.setItem('isVerified', '1'); } catch (e) {}

          successBox.textContent = "✅ Phone verified successfully!";
          successBox.style.display = "block";

          // --- NEW: Update UI with user data ---
          updateUserUI(user);
          
          setTimeout(() => {
            modal.style.display = "none";
            phoneStep.style.display = "block";
            otpStep.style.display = "none";
            otpInput.value = "";
            phoneInput.value = "";
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
            verifyOtpBtn.textContent = "Verify";
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
        // --- NEW: Reset UI on logout ---
        updateUserUI(null);
      }
    });

  } // end setupLoginModal

  // Run setup after DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupLoginModal);
  } else {
    setupLoginModal();
  }

  // Expose the showLoginModal function globally
  window.LoginModal = {
    show: showLoginModal
  };

})();