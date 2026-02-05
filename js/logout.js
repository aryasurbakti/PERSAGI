import { signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { auth } from "../firebase.js"; // sesuaikan path

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {
  btnLogout.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      await signOut(auth);
      alert("Berhasil logout");
      window.location.href = "home.html";
    } catch (err) {
      console.error(err);
      alert("Gagal logout");
    }
  });
}
