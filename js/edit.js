import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===============================
   Ambil ID dari URL (VALIDASI)
================================ */
const params = new URLSearchParams(window.location.search);
const artworkId = params.get("id");

if (!artworkId) {
  alert("ID karya tidak ditemukan!");
  throw new Error("artworkId null");
}

let currentUser = null;

/* ===============================
   AUTH GUARD
================================ */
onAuthStateChanged(window.auth, async (user) => {
  if (!user) {
    alert("Harus login");
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  try {
    const ref = doc(window.db, "artworks", artworkId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("Karya tidak ditemukan");
      window.location.href = "home.html";
      return;
    }

    // 🔒 Cek pemilik karya
    if (snap.data().userId !== user.uid) {
      alert("Bukan karya kamu!");
      window.location.href = "home.html";
      return;
    }

    // Isi form
    document.getElementById("title").value = snap.data().title;
    document.getElementById("description").value =
      snap.data().description || "";

  } catch (err) {
    console.error(err);
    alert("Gagal mengambil data");
  }
});

/* ===============================
   SIMPAN PERUBAHAN
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveBtn");

  if (!saveBtn) return;

  saveBtn.addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title) {
      alert("Judul wajib diisi");
      return;
    }

    try {
      await updateDoc(doc(window.db, "artworks", artworkId), {
        title,
        description
      });

      alert("Karya berhasil diupdate");
      window.location.href = "profil.html";

    } catch (err) {
      console.error(err);
      alert("Gagal update karya");
    }
  });
});


