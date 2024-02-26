import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLjD1rA2AsB9SRUoxsIcoLIDkMO74Gqjs",
  authDomain: "albion-build.firebaseapp.com",
  projectId: "albion-build",
  storageBucket: "albion-build.appspot.com",
  messagingSenderId: "893395575402",
  appId: "1:893395575402:web:e2f3f92920cbb10061a013",
  measurementId: "G-0J59GRN1PE"
};
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const storage = getStorage(app);

  export { firestore, storage };