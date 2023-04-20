import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db, getCurrentUser } from "@/settings/firebase";

import { deleteImageFromFirebase } from "./image";

export const deleteRecordFromFirestore = async (recordId: string): Promise<void> => {
  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) {
    throw new Error("ユーザーが不正です。");
  }
  const record = await getDoc(doc(db, "users", uid, "records", recordId));
  const imageName = record.data()?.imageName;
  try {
    if (imageName) {
      await deleteImageFromFirebase(imageName);
    }
    await deleteDoc(doc(db, "users", uid, "records", recordId));
  } catch (e) {
    console.log(e);
    return;
  }
};
