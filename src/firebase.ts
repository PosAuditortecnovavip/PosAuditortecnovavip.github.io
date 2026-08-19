<<<<<<< HEAD
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyD0kPXrPQgJOxgFNPLobubIKBti_Yab4MQ",

  authDomain: "auditypro-2026.firebaseapp.com",

  projectId: "auditypro-2026",

  storageBucket: "auditypro-2026.firebasestorage.app",

  messagingSenderId: "50834910680",

  appId: "1:50834910680:web:50f68ba81e9773999516ad",

  measurementId: "G-1G9B2NDGPP"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);


=======
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyD0kPXrPQgJOxgFNPLobubIKBti_Yab4MQ",

  authDomain: "auditypro-2026.firebaseapp.com",

  projectId: "auditypro-2026",

  storageBucket: "auditypro-2026.firebasestorage.app",

  messagingSenderId: "50834910680",

  appId: "1:50834910680:web:50f68ba81e9773999516ad",

  measurementId: "G-1G9B2NDGPP"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);


>>>>>>> afedd5243f9d5f6202f5c26d127f813c8672c864
