// js/firebase-config.js (CLEANED)

const firebaseConfig = {
  apiKey: "AIzaSyAy1CAxcuIM929hwb6dn1wA6umUJM3LP-4",
  authDomain: "worthyten-otp-a925d.firebaseapp.com",
  projectId: "worthyten-otp-a925d",
  storageBucket: "worthyten-otp-a925d.firebasestorage.app",
  messagingSenderId: "1067702314639",
  appId: "1:1067702314639:web:0bb2a39181720c306572fa",
  measurementId: "G-WBXQ5SM16Y"
};

// Validate config
function validateFirebaseConfig(config) {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  for (const field of requiredFields) {
    if (!config[field] || config[field].trim() === '') {
      console.error(`Firebase config missing required field: ${field}`);
      return false;
    }
  }
  return true;
}

if (validateFirebaseConfig(firebaseConfig)) {
  window.__FIREBASE_CONFIG = firebaseConfig;
  console.log('✅ Firebase config validated and set');
} else {
  console.error('❌ Firebase config validation failed');
  window.__FIREBASE_CONFIG = null;
}

// Auto-init if compat SDK loaded
// This is the ONLY initialization block.
if (window.firebase && typeof window.firebase.initializeApp === "function") {
  if (!window.firebase.apps || window.firebase.apps.length === 0) {
    try {
      if (window.__FIREBASE_CONFIG) {
        window.firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase initialized successfully with REAL credentials!");
      }
    } catch (error) {
      console.error("❌ Firebase initialization error:", error.code, error.message);
      window.__FIREBASE_DISABLED = true;
    }
  } else {
    console.log("Firebase already initialized.");
  }
} else {
  console.warn("⚠️ Firebase SDK not loaded yet.");
}