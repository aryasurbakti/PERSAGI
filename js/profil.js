import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc
} from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth, db } from "../firebase.js";

// ==========================
// AUTH GUARD
// ==========================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Silakan login");
    window.location.href = "login.html";
    return;
  }

  // ==========================
  // DATA USER
  // ==========================
  const userSnap = await getDoc(doc(db, "users", user.uid));
  if (userSnap.exists()) {
    const data = userSnap.data();
    document.getElementById("name").innerText = data.name;
    document.getElementById("email").innerText = data.email;
    document.getElementById("userInitial").innerText =
      data.name.charAt(0).toUpperCase();
  }

  // ==========================
  // AMBIL KARYA USER
  // ==========================
  const q = query(
    collection(db, "artworks"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);
  const container = document.getElementById("myArtworks");
  container.innerHTML = "";

  if (snapshot.empty) {
    container.innerHTML = "<p>Belum ada karya.</p>";
    return;
  }

  // ==========================
  // RENDER HTML
  // ==========================
  snapshot.forEach(docSnap => {
    const d = docSnap.data();
    const id = docSnap.id;

    container.innerHTML += `
      <div class="artwork-item">
        <img src="${d.imageUrl}" class="artwork-img">
        <div class="artwork-info">
          <h4>${d.title}</h4>
          <div class="action-btns">
            <button class="btn-edit" data-id="${id}">Edit</button>
            <button class="btn-delete" data-id="${id}">Hapus</button>
          </div>
        </div>
      </div>
    `;
  });

  // ==========================
  // EVENT EDIT
  // ==========================
  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      window.location.href = `edit.html?id=${id}`;
    });
  });

  // ==========================
  // EVENT HAPUS
  // ==========================
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      if (!confirm("Yakin ingin menghapus karya ini?")) return;

      await deleteDoc(doc(db, "artworks", id));
      alert("Karya berhasil dihapus");
      location.reload();
    });
  });

});

// ==========================
// LOGOUT
// ==========================
document.getElementById("btnLogout")
  .addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
