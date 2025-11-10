// ===== Firebase OTP Verification Flow =====

// Get elements
const finishBtn = document.getElementById("finishBtn");
const modal = document.getElementById("simple-login-modal");
const closeModal = document.getElementById("login-modal-close");
const phoneInput = document.getElementById("login-phone");
const otpInput = document.getElementById("login-otp");
const sendOtpBtn = document.getElementById("send-otp-btn");
const verifyOtpBtn = document.getElementById("verify-otp-btn");
const phoneStep = document.getElementById("login-step-phone");
const otpStep = document.getElementById("login-step-otp");
const errorBox = document.getElementById("login-error");
const successBox = document.getElementById("login-success");

// Show modal when Finish is clicked
finishBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
  errorBox.style.display = "none";
  successBox.style.display = "none";

  // Initialize reCAPTCHA only once
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: function(response) {
        console.log("reCAPTCHA verified");
      }
    });
  }
});

// Close modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  phoneInput.value = "";
  otpInput.value = "";
  phoneStep.style.display = "block";
  otpStep.style.display = "none";
});

// Send OTP
sendOtpBtn.addEventListener("click", () => {
  const number = phoneInput.value.trim();

  if (number.length !== 10) {
    errorBox.textContent = "Please enter a valid 10-digit number.";
    errorBox.style.display = "block";
    return;
  }

  const fullPhone = "+91" + number;
  const appVerifier = window.recaptchaVerifier;

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
      errorBox.textContent = error.message;
      errorBox.style.display = "block";
    });
});

// Verify OTP
verifyOtpBtn.addEventListener("click", () => {
  const code = otpInput.value.trim();

  if (code.length !== 6) {
    errorBox.textContent = "Please enter a valid 6-digit OTP.";
    errorBox.style.display = "block";
    return;
  }

  window.confirmationResult.confirm(code)
    .then((result) => {
      const user = result.user;
      console.log("Verified:", user.phoneNumber);

      // Show success briefly before redirect
      successBox.textContent = "✅ Phone verified successfully!";
      successBox.style.display = "block";

      setTimeout(() => {
        modal.style.display = "none";
        window.location.href = "summary.html";
      }, 1000);
    })
    .catch((error) => {
      console.error("Verification failed:", error);
      errorBox.textContent = "Invalid OTP. Please try again.";
      errorBox.style.display = "block";
    });
});
