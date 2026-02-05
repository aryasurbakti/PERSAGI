import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;
let currentUserName = "Anonymous";

onAuthStateChanged(window.auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    currentUser = user;

    // 🔹 Ambil nama user dari Firestore
    const userDoc = await getDoc(
      doc(window.db, "users", user.uid)
    );

    if (userDoc.exists()) {
      currentUserName = userDoc.data().name;
    }
  }
});

document.getElementById("uploadBtn")
  .addEventListener("click", uploadArtwork);

async function uploadArtwork() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const file = document.getElementById("image").files[0];

  if (!title || !file) {
    alert("Judul dan gambar wajib diisi");
    return;
  }

  try {
    // 🔹 Upload ke Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "artwork_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkwwhxq1k/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();

    // 🔹 Simpan ke Firestore
    await addDoc(collection(window.db, "artworks"), {
      title,
      description,
      imageUrl: data.secure_url,
      userId: currentUser.uid,
      userName: currentUserName, // 👈 PENTING
      createdAt: serverTimestamp()
    });

    alert("Artwork berhasil diupload!");
    window.location.href = "home.html";

  } catch (err) {
    console.error(err);
    alert("Upload gagal");
  }
}




