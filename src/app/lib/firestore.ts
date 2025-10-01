import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { Thing } from "@/types";

// Create
export async function addThing(title: string) {
  return await addDoc(collection(db, "things"), {
    title,
    items: [],
    trashed: false,
    createdAt: new Date(),
  });
}

// Read (購読)
export function subscribeThings() {}

// Update
export function updateThing() {}

// Delete
export function deleteThing() {}
