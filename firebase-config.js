// ===================================================================
// Replace this with YOUR OWN Firebase project config.
// Get it from: Firebase Console > Project Settings > General
// > "Your apps" > Web app > SDK setup and configuration
// ===================================================================

const firebaseConfig = {
  apiKey: "AIzaSyDPzv-4xbUB_HcLQrHKzf_ChTUO2SivBLs",
  authDomain: "simple-message-database.firebaseapp.com",
  projectId: "simple-message-database",
  storageBucket: "simple-message-database.firebasestorage.app",
  messagingSenderId: "191393388887",
  appId: "1:191393388887:web:dd1b5eafc53e0ea2ed8612"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
