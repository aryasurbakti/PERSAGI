import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { addDoc, collection, serverTimestamp } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;

// CEK LOGIN
onAuthStateChanged(window.auth, (user) => {
  if (!user) {
    alert("Harus login dulu!");
    window.location.href = "login.html";
  } else {
    currentUser = user;
  }
});

// FUNGSI UPLOAD
async function uploadArtwork() {
  console.log("TOMBOL UPLOAD DIKLIK");

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const file = document.getElementById("image").files[0];

  if (!title || !file) {
    alert("Judul dan gambar wajib diisi");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "artwork_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkwwhxq1k/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
console.log("RESPON CLOUDINARY:", data);


    if (!data.secure_url) {
      throw new Error("Upload Cloudinary gagal");
    }

    await addDoc(collection(window.db, "artworks"), {
      title,
      description,
      imageUrl: data.secure_url,
      userId: currentUser.uid,
      createdAt: serverTimestamp()
    });

    alert("Artwork berhasil diupload!");
    window.location.href = "index.html";

  } catch (err) {
    console.error(err);
    alert("Upload gagal, cek console");
  }
}

// 🔥 EVENT LISTENER HARUS DI SINI
document
  .getElementById("uploadBtn")
  .addEventListener("click", uploadArtwork);



