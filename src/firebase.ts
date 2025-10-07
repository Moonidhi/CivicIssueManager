import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBTaeXc2Gkl9HTq3-FxhkM07ypnSkC-QBQ",
  authDomain: "civicissuemanager.firebaseapp.com",
  projectId: "civicissuemanager",
  storageBucket: "civicissuemanager.firebasestorage.app",
  messagingSenderId: "560299589083",
  appId: "1:560299589083:web:c468b0fec12c08b50ebbfe",
  measurementId: "G-XFX60XJVF0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);        // Firestore
export const storage = getStorage(app);     // Storage
export const analytics = getAnalytics(app); // Analytics (optional)
