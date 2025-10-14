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
  getDocs,
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

export async function moveUpThing(thingID: string) {
  const thingsCol = collection(db, KEY_THINGS);
  const snapshot = await getDocs(thingsCol);
  const things = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Thing[]; // things

  const index = things.findIndex((t) => t.id === thingID);
  if (index <= 0) return;

  const current = things[index];
  const prev = things[index - 1];

  const currentRef = doc(db, KEY_THINGS, current.id);
  const prevRef = doc(db, KEY_THINGS, prev.id);

  await Promise.all([
    updateDoc(currentRef, { order: prev.order }), //
    updateDoc(prevRef, { order: current.order }),
  ]);
}

// export function subscribeThings(callback: (things: Thing[]) => void) {
//   const q = query(collection(db, KEY_THINGS), orderBy("createdAt", "asc"));
//   return onSnapshot(q, (snapshot) => {
//     const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Thing));
//     callback(data);
//   });
// }

export async function moveDownThing(thingID: string) {}

// moveUp: (id: string) => {
//   const things = [...get().things];
//   const index = things.findIndex((t) => t.id === id);
//   if (index > 0) {
//     [things[index - 1], things[index]] = [things[index], things[index - 1]];
//     set({ things });
//   }
// },
