import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// 2. Firestore に保存
export async function addThing(thingsLength: number) {
  try {
    const docRef = await addDoc(collection(db, "things"), {
      id: Date.now().toString(),
      title: "新しいThing",
      items: [],
      order: thingsLength,
      trashed: false,
      createdAt: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document ", e);
  }
}
