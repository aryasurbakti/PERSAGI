import { db } from "../firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const artworkContainer = document.getElementById("artworks");

async function renderArtworks() {
  const q = query(
    collection(db, "artworks"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  artworkContainer.innerHTML = "";

  snapshot.forEach(doc => {
    const d = doc.data();

    artworkContainer.innerHTML += `
      <div class="artwork">
        <img src="${d.imageUrl}">
        <div class="artwork-content">
          <h3>${d.title}</h3>
          <p>${d.description || ""}</p>
          <small class="uploader">👤 ${d.userName || "Unknown"}</small>
        </div>
      </div>
    `;
  });
}

renderArtworks();





