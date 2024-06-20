import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";


const firebaseConfig = {
    //Paste Your firebase config here
   
    apiKey: "AIzaSyBzeWg0O4v2tKyx7FmK5Pr9t6d7U6AdtdE",
    authDomain: "arene1.firebaseapp.com",
    projectId: "arene1",
    storageBucket: "arene1.appspot.com",
    messagingSenderId: "240905111995",
    appId: "1:240905111995:web:6f0d71f26768c1e7a81c9e"
    
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase }



