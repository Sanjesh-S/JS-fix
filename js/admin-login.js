// js/admin-login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('admin-email');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const loginButton = document.getElementById('login-button');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';
        loginError.style.display = 'none';

        if (!firebase || !firebase.auth) {
            loginError.textContent = 'Firebase is not initialized.';
            loginError.style.display = 'block';
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
            return;
        }

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Success! Redirect to the admin dashboard
                window.location.href = 'admin.html';
            })
            .catch((error) => {
                // Handle Errors
                console.error("Login failed:", error.code, error.message);
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    loginError.textContent = 'Invalid email or password.';
                } else {
                    loginError.textContent = 'An error occurred. Please try again.';
                }
                loginError.style.display = 'block';
                loginButton.disabled = false;
                loginButton.textContent = 'Login';
            });
    });
});