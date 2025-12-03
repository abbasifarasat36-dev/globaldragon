import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "crypto-dragon-8a27a.firebaseapp.com",
  databaseURL: "https://crypto-dragon-8a27a-default-rtdb.firebaseio.com",
  projectId: "crypto-dragon-8a27a",
  storageBucket: "crypto-dragon-8a27a.firebasestorage.app",
  messagingSenderId: "358075688386",
  appId: "1:358075688386:web:16dd3b6a90cdd0588aa25b",
  measurementId: "G-B16JX6XD9W"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };