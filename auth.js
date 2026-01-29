// auth.js
import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function register(name, email, password) {
  if (!name || !email || !password) {
    alert("Semua field wajib diisi");
    return;
  }

  try {
    // 1. Simpan akun ke Firebase Auth
    const res = await createUserWithEmailAndPassword(auth, email, password);

    // 2. Simpan data user ke Firestore
    await setDoc(doc(db, "users", res.user.uid), {
      name: name,
      email: email,
      role: "user",
      createdAt: new Date()
    });

    alert("Registrasi berhasil!");
    window.location.href = "login.html";

  } catch (error) {
    alert(error.message);
  }
}

