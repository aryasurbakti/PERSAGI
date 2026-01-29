import { auth, db } from "../firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Tampilkan email
    document.getElementById("email").innerText = user.email;

    // Ambil data nama dari Firestore
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        document.getElementById("name").innerText = userData.name;
        
        // Ambil inisial nama untuk avatar
        document.getElementById("userInitial").innerText = userData.name.charAt(0).toUpperCase();
      }
    } catch (error) {
      console.error("Error mengambil data:", error);
    }
  } else {
    window.location.href = "login.html";
  }
});

// Fitur Logout
document.getElementById("btnLogout").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "home.html";
  });
});
