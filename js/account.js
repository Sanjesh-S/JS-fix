// js/account.js
document.addEventListener("DOMContentLoaded", () => {
  let db;
  let userRef;
  let currentUser = null;

  const nameInput = document.getElementById('account-name');
  const emailInput = document.getElementById('account-email');
  const phoneInput = document.getElementById('account-phone');
  const coinBalance = document.getElementById('account-coin-balance');
  const form = document.getElementById('account-form');
  const saveBtn = document.getElementById('save-profile-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const statusEl = document.getElementById('account-form-status');

  if (!firebase.auth || !firebase.firestore) {
    console.error("Firebase not loaded");
    return;
  }

  db = firebase.firestore();

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
      currentUser = user;
      userRef = db.collection('users').doc(user.uid);
      loadUserData(user);
    } else {
      // No user is signed in. Redirect to login.
      console.log('No user signed in. Redirecting to login.');
      window.location.href = 'login.html';
    }
  });

  async function loadUserData(user) {
    try {
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const data = userDoc.data();
        nameInput.value = data.displayName || '';
        emailInput.value = data.email || '';
        phoneInput.value = data.phoneNumber || user.phoneNumber || 'N/A';
        coinBalance.textContent = data.coins || 0;
      } else {
        // This case should be rare if js/login.js runs first
        phoneInput.value = user.phoneNumber || 'N/A';
        coinBalance.textContent = 0;
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      statusEl.textContent = 'Error loading data.';
      statusEl.style.color = 'var(--danger)';
      statusEl.style.display = 'block';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    statusEl.style.display = 'none';

    try {
      const dataToSave = {
        displayName: nameInput.value.trim(),
        email: emailInput.value.trim()
      };
      
      // Use set with merge:true to create or update
      await userRef.set(dataToSave, { merge: true });

      statusEl.textContent = 'Profile saved successfully!';
      statusEl.style.color = 'var(--ok)';
      statusEl.style.display = 'block';

    } catch (error) {
      console.error("Error saving profile:", error);
      statusEl.textContent = 'Error: ' + error.message;
      statusEl.style.color = 'var(--danger)';
      statusEl.style.display = 'block';
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Profile';
    }
  });

  logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      console.log('User logged out.');
      window.location.href = 'index.html';
    }).catch((error) => {
      console.error('Sign out error:', error);
    });
  });

});