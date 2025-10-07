import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { Thing } from "@/types";

// Thing
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
export function subscribeThings(callback: (things: Thing[]) => void) {
  const q = query(collection(db, "things"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Thing));
    callback(data);
  });
}

// Update
export async function updateThing(id: string, newData: Partial<Thing>) {
  const ref = doc(db, "thing", id);
  await updateDoc(ref, newData);
}

// Delete
export async function deleteThing(id: string) {
  const ref = doc(db, "things", id);
  await deleteDoc(ref);
}

// Item
