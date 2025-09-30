import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { Thing } from "@/types";
import { create } from "domain";
import { KEYS } from "@/constants/keys";

// Create
export async function addThing(title: string) {
  return await addDoc(collection(db, KEYS.THINGS), {
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
