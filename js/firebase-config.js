// js/firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyC4SqbxwKCJmUBNKt85UwEJgNnep9t7qOY",
  authDomain: "worthyten-otp-a925d.firebaseapp.com",
  projectId: "worthyten-otp-a925d",
  storageBucket: "worthyten-otp-a925d.appspot.com",
  messagingSenderId: "1067702314639",
  appId: "1:1067702314639:web:0bb2a3918720c306572fa",
  measurementId: "G-WBXQ5SM16Y" // optional
};

window.__FIREBASE_CONFIG = firebaseConfig;

// Optional auto-init if compat SDK already loaded:
if (window.firebase && typeof window.firebase.initializeApp === "function") {
  if (!window.firebase.apps || window.firebase.apps.length === 0) {
    window.firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized automatically from firebase-config.js");
  }
}
