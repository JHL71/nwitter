
import { initializeApp } from "firebase/app";
import * as fbAuth from "firebase/auth";
import * as fbfs from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_ID,
  appId: process.env.REACT_APP_APP_ID
};

export const app = initializeApp(firebaseConfig);

export const db = fbfs.getFirestore(app);
export { fbAuth, fbfs };