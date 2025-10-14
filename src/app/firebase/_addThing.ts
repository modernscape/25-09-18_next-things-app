// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../lib/firebase";

// // 2. Firestore に保存
// export async function _addThing(title: string) {
//   try {
//     const docRef = await addDoc(collection(db, "things"), {
//       id: Date.now().toString(),
//       title,
//       items: [],
//       order: 0,
//       trashed: false,
//       createdAt: new Date(),
//     });
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document ", e);
//   }
// }
