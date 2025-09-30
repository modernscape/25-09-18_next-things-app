import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Thing } from "../types";

export async function getThings() {
  const querySnapshot = await getDocs(collection(db, "things"));
  const things = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Thing[];
  console.log(things);
  return things;
}
