import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, type User } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCK-gWxILiqc7-snQeS_ay1JXaWL4fuIqk",
  authDomain: "tako-board-1.firebaseapp.com",
  projectId: "tako-board-1",
  storageBucket: "tako-board-1.appspot.com",
  messagingSenderId: "259270451270",
  appId: "1:259270451270:web:b206ef1f2dc1aac6df6a47",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// https://blog.35d.jp/2020-04-06-nuxt-firebase-auth
// ユーザーを常に正しく取得できるためのpromise wrapper
export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      resolve(user);
      unsubscribe();
    });
  });
}

export { firebaseApp, db, auth, storage };
