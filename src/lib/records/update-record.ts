import { db, getCurrentUser } from "@/settings/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { recordConverter } from "./record-firestore-converter";

/**
 * レコードを更新する際のデータ
 */
interface RecordUpdateData {
  recordDate?: string;
  comment?: string;
}
const validateUpdateData = (updateData: RecordUpdateData): boolean => {
  if (updateData.recordDate === undefined && updateData.comment === undefined) return false;
  let validated = true;
  if (updateData.recordDate !== undefined) {
    validated &&= !isNaN(new Date(updateData.recordDate).getTime());
  }
  return validated;
};

const updateOneRecord = async (userId: string, recordId: string, payload: RecordUpdateData) => {
  const user = await getCurrentUser();
  if (!user?.uid) {
    throw new Error("ユーザーが不正です。");
  }
  if (!validateUpdateData(payload)) {
    throw new Error("与えられたデータの一部が無効です。");
  }

  const docRef = doc(db, "users", userId, "records", recordId).withConverter(recordConverter);
  await updateDoc(docRef, payload);
};

export { type RecordUpdateData, updateOneRecord };
