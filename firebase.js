import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA769Eb0MSCDKOcu-4-2MgOzQCIYhN8Kwo",
  authDomain: "persagi-9699e.firebaseapp.com",
  projectId: "persagi-9699e",
  storageBucket: "persagi-9699e.firebasestorage.app",
  messagingSenderId: "491949405417",
  appId: "1:491949405417:web:7f33dd4ad7db7eda90ec78",
};

const app = initializeApp(firebaseConfig);

// Tambahkan kata 'export' di depan const
export const auth = getAuth(app);
export const db = getFirestore(app);

// Tetap simpan di window jika file lain (seperti upload.js) masih membutuhkannya
window.auth = auth;
window.db = db;

