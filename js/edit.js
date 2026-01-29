import { auth, db, storage } from "./firebase.js";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔹 Ambil ID dari URL
const params = new URLSearchParams(window.location.search);
const artworkId = params.get("id");

let currentUser = null;
let oldImageUrl = null;

// 🔐 Cek login & kepemilikan
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Harus login");
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  const docRef = doc(db, "artworks", artworkId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists() || docSnap.data().userId !== user.uid) {
    alert("Tidak diizinkan");
    window.location.href = "profil.html";
    return;
  }

  const data = docSnap.data();
  document.getElementById("title").value = data.title;
  document.getElementById("description").value = data.description || "";
  oldImageUrl = data.imageUrl;
});

// 🚀 Update artwork
window.updateArtwork = async function () {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const file = document.getElementById("image").files[0];

  let imageUrl = oldImageUrl;

  try {
    // Jika ganti gambar
    if (file) {
      const imageRef = ref(
        storage,
        `artworks/${currentUser.uid}/${Date.now()}_${file.name}`
      );
      await uploadBytes(imageRef, file);
      imageUrl = await getDownloadURL(imageRef);
    }

    await updateDoc(doc(db, "artworks", artworkId), {
      title: title,
      description: description,
      imageUrl: imageUrl,
      updatedAt: serverTimestamp()
    });

    alert("Artwork berhasil diperbarui");
    window.location.href = "profil.html";

  } catch (err) {
    console.error(err);
    alert("Gagal update artwork");
  }
};
