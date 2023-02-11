import { doc, getDoc } from "@firebase/firestore";
import { db, getCurrentUser } from "@/settings/firebase";
import type { Record } from "./record";
import { recordConverter } from "./record-firestore-converter";

/**
 * idを指定して一つレコードを取得する
 */
export const getRecord = async (userId: string, recordId: string): Promise<Record | void> => {
  // Recordリストの参照を受け取って中身を追加する
  const user = await getCurrentUser();
  if (!user?.uid) return;
  const docRef = doc(db, "users", userId, "records", recordId).withConverter(recordConverter);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("cannot found the id : " + recordId);
    return;
  }
};
