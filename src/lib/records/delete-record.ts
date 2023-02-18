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
  if (imageName) {
    await deleteImageFromFirebase(imageName);
  }
  // TODO: 画像消去後にドキュメント消去に失敗すると画像データだけ消えてしまう可能性がある. 先にドキュメントを消すべきかも
  await deleteDoc(doc(db, "users", uid, "records", recordId));
};
