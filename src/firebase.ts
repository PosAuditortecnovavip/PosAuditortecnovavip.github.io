import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
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

// ESTO ES LO QUE PERMITE QUE FUNCIONE SIN INTERNET
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

export const auth = getAuth(app);
