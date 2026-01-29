import { db } from "../firebase.js"; // Sesuaikan path jika home.js ada di folder /js/
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Ganti "artworks" menjadi "artworkList" agar sesuai dengan ID di HTML kamu
const artworkContainer = document.getElementById("artworkList");

async function renderArtworks() {
    try {
        // Tambahkan query agar karya terbaru muncul di atas
        const q = query(collection(db, "artworks"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        // Bersihkan loading/isi sebelumnya
        artworkContainer.innerHTML = "";

        if (snapshot.empty) {
            artworkContainer.innerHTML = "<p>Belum ada karya seni yang diupload.</p>";
            return;
        }

        snapshot.forEach(doc => {
            const d = doc.data();
            artworkContainer.innerHTML += `
                <div class="artwork">
                    <img src="${d.imageUrl}" alt="${d.title}">
                    <div class="artwork-content">
                        <h3>${d.title}</h3>
                        <p>${d.description || ""}</p>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Gagal memuat data:", error);
        artworkContainer.innerHTML = "<p>Gagal memuat galeri. Cek console untuk detail.</p>";
    }
}

// Jalankan fungsi
renderArtworks();

