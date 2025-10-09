import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, getDoc, arrayUnion } from "firebase/firestore";
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
// Create
export async function addItem_OLD(thingID: string) {
  const ref = doc(db, "things", thingID);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    const thing = snapshot.data();
    const newItem = { id: Date.now().toString(), text: "New Item" };
    const items = [...thing.items, newItem];
    const newThing = { ...thing, items };
    await updateDoc(ref, newThing);
  }
}

export async function addItem(thingID: string, text: string = "New Item") {
  const ref = doc(db, "things", thingID);
  const newItem = { id: Date.now().toString(), text };

  await updateDoc(ref, {
    items: arrayUnion(newItem),
  });
}

// export async function addItem(thingID: string) {
//   const ref = doc(db, "things", thingID);
//   const snapshot = await getDoc(ref);
//   if (!snapshot.exists()) return;

//   const thing = snapshot.data() as Thing;
//   const newItem = { id: Date.now().toString(), text: "New Item" };

//   await updateDoc(ref, {
//     items: [...thing.items, newItem], // itemsだけ更新
//   });
// }
