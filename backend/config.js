
import { initializeApp } from 'firebase/app';
import { getAuth} from "firebase/auth";
import { getFirestore} from 'firebase/firestore';




// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTVqJkOVWfHZWnaeuShXhZH_Z7rsZtgNY",
  authDomain: "reniew-5a418.firebaseapp.com",
  projectId: "reniew-5a418",
  storageBucket: "reniew-5a418.appspot.com",
  messagingSenderId: "40870201810",
  appId: "1:40870201810:web:8c76a7940c20e51f37a00b",
  measurementId: "G-59Z00GH1RX"
};

const app = initializeApp(firebaseConfig);



const auth = getAuth(app)

const db = getFirestore(app);



  export {auth, db}


// Initialize Firebase



