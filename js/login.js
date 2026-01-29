import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const btnLogin = document.getElementById('btnLogin');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

btnLogin.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  // Berikan feedback visual ke user
  btnLogin.innerText = "Memproses...";
  btnLogin.disabled = true;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // BERHASIL LOGIN
      alert("Selamat datang!");
      window.location.href = "dashboard.html"; // Ganti dengan halaman tujuan Anda
    })
    .catch((error) => {
      // GAGAL LOGIN
      btnLogin.innerText = "Login";
      btnLogin.disabled = false;
      
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential') {
        alert("Email atau password salah.");
      } else {
        alert("Terjadi kesalahan: " + error.message);
      }
    });
});




