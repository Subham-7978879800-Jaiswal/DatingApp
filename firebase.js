import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFMBdt4wpwFR3GUuQJJdCH3Mqy9FPV81o",
  authDomain: "dating-app-fc509.firebaseapp.com",
  projectId: "dating-app-fc509",
  storageBucket: "dating-app-fc509.appspot.com",
  messagingSenderId: "981884698734",
  appId: "1:981884698734:web:fbd82d3e49d7d32171a67f",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import firebase from "firebase/compat";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCFMBdt4wpwFR3GUuQJJdCH3Mqy9FPV81o",
//   authDomain: "dating-app-fc509.firebaseapp.com",
//   projectId: "dating-app-fc509",
//   storageBucket: "dating-app-fc509.appspot.com",
//   messagingSenderId: "981884698734",
//   appId: "1:981884698734:web:fbd82d3e49d7d32171a67f",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth();
// const db = getFirestore();

// export { auth, db };
