import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./firebase";
import { Thing } from "@/types";

const KEY_THINGS = "things";

// Thing
// Create
export async function addThing(title: string) {
  return await addDoc(collection(db, KEY_THINGS), {
    title,
    items: [],
    trashed: false,
    createdAt: new Date(),
  });
}

// Read (購読)
export function subscribeThings(callback: (things: Thing[]) => void) {
  const q = query(collection(db, KEY_THINGS), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Thing));
    callback(data);
  });
}

// Update
export async function updateThing(id: string, newData: Partial<Thing>) {
  const ref = doc(db, KEY_THINGS, id);
  await updateDoc(ref, newData);
}

// Delete
export async function deleteThing(id: string) {
  const ref = doc(db, KEY_THINGS, id);
  await deleteDoc(ref);
}

// Item
// Create
export async function addItem(thingID: string, text: string = "New Item") {
  const ref = doc(db, KEY_THINGS, thingID);
  const newItem = { id: Date.now().toString(), text };

  await updateDoc(ref, {
    items: arrayUnion(newItem),
  });
}

// Update
export async function updateItem(thingID: string, itemID: string, newTitle: string) {
  const ref = doc(db, KEY_THINGS, thingID);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;

  const thing = snapshot.data() as Thing;
  const oldItem = thing.items.find((item) => item.id === itemID);
  if (!oldItem) return;

  if (newTitle === "") {
    await updateDoc(ref, {
      items: arrayRemove(oldItem),
    });
  } else {
    const newItem = { ...oldItem, text: newTitle };

    await updateDoc(ref, {
      items: arrayRemove(oldItem),
    });
    await updateDoc(ref, {
      items: arrayUnion(newItem),
    });
  }
}

// export async function updateItem(thingID: string, itemID: string, newTitle: string) {
//   const ref = doc(db, "things", thingID);

//   await runTransaction(db, async (transaction) => {
//     const snapshot = await transaction.get(ref);
//     if (!snapshot.exists()) return;

//     const thing = snapshot.data() as Thing;
//     const items = thing.items.map((item) => (item.id === itemID ? { ...item, text: newTitle } : item));

//     transaction.update(ref, { items });
//   });
// }

// Remove
//  async function removeItem(thingID: string, itemID: string) {
//   const ref = doc(db, KEY_THINGS, thingID);
//   const snapshot = await getDoc(ref);
//   if (!snapshot) return;

//   const thing = snapshot.data() as Thing;
//   const oldItem = thing.items.find((item) => item.id === itemID);
//   if (!oldItem) return;

//   await updateDoc(ref, {
//     items: arrayRemove(oldItem),
//   });
// }
