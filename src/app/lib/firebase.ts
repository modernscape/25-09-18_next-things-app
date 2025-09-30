// 1. Firebase セットアップ

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOTb4EJ5ALjZuulL-AfZSy-Awi4g2vRYw",
  authDomain: "next-things-app-9d94b.firebaseapp.com",
  projectId: "next-things-app-9d94b",
  storageBucket: "next-things-app-9d94b.firebasestorage.app",
  messagingSenderId: "1056548789659",
  appId: "1:1056548789659:web:4364c8981a3c925377953e",
  measurementId: "G-431N4Q8HZ6",
};

// 初期化
const app = initializeApp(firebaseConfig);

// Firestore インスタンス
export const db = getFirestore(app);
