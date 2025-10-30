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

const key_things = "things";

// Thing
// Create
export async function addThing(title: string, order: number) {
  return await addDoc(collection(db, key_things), {
    title,
    items: [],
    trashed: false,
    order: order,
    createdAt: new Date(),
  });
}

// Read (購読)
export function subscribeThings(callback: (things: Thing[]) => void) {
  const q = query(collection(db, key_things), orderBy("order", "asc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Thing));
    callback(data);
  });
}

// Update
export async function updateThing(id: string, newData: Partial<Thing>) {
  const ref = doc(db, key_things, id);
  await updateDoc(ref, newData);
}

// Delete
export async function deleteThing(id: string) {
  const ref = doc(db, key_things, id);
  await deleteDoc(ref);
}

// Item
// Create
export async function addItem(thingID: string, text: string = "New Item") {
  const ref = doc(db, key_things, thingID);
  const newItem = { id: Date.now().toString(), text };

  await updateDoc(ref, {
    items: arrayUnion(newItem),
  });
}

// Update、Delete
export async function updateItem(thingID: string, itemID: string, newText: string) {
  const thingRef = doc(db, key_things, thingID); // thing
  const snapshot = await getDoc(thingRef); // thing
  if (!snapshot.exists()) return;

  const thing = snapshot.data() as Thing; // thing
  const oldItem = thing.items.find((item) => item.id === itemID); // item
  if (!oldItem) return;

  updateDoc(thingRef, {
    items: arrayRemove(oldItem),
  });

  if (newText !== "") {
    await updateDoc(thingRef, {
      items: arrayUnion({ ...oldItem, text: newText }),
    });
  }
}

// moveUp, moveUDown
import { runTransaction } from "firebase/firestore";

export async function moveThing(thingID: string, up: boolean) {
  const q = query(collection(db, key_things), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  const things = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Thing[];

  const index = things.findIndex((t) => t.id === thingID);
  if (index === -1) return;

  const swapIndex = up ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= things.length) return;

  const currentRef = doc(db, key_things, things[index].id);
  const targetRef = doc(db, key_things, things[swapIndex].id);

  await runTransaction(db, async (tx) => {
    tx.update(currentRef, { order: swapIndex });
    tx.update(targetRef, { order: index });
  });
}

// export async function moveThing(thingID: string, up: boolean) {
//   const q = query(collection(db, key_things), orderBy("order", "asc"));
//   const snapshot = await getDocs(q);
//   const things = snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   })) as Thing[]; // things

//   const index = things.findIndex((t) => t.id === thingID);
//   const current = things[index];
//   const currentRef = doc(db, key_things, current.id);

//   if (up) {
//     if (index <= 0) return;
//     const prev = things[index - 1];
//     const prevRef = doc(db, key_things, prev.id);

//     await Promise.all([
//       updateDoc(currentRef, { order: prev.order }), //
//       updateDoc(prevRef, { order: current.order }),
//     ]);
//   } else {
//     if (index >= things.length - 1) return;
//     const next = things[index + 1];
//     const nextRef = doc(db, key_things, next.id);

//     await Promise.all([
//       updateDoc(currentRef, { order: next.order }), //
//       updateDoc(nextRef, { order: current.order }),
//     ]);
//   }
// }
