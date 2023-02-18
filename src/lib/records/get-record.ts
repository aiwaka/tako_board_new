import { collectionGroup, doc, getDoc, getDocs, query, QueryConstraint } from "@firebase/firestore";
import { db, getCurrentUser } from "@/settings/firebase";

import type { Record } from "./record";
import { recordConverter } from "./record-firestore-converter";

/**
 * idを指定して一つレコードを取得する
 */
export const getOneRecord = async (userId: string, recordId: string): Promise<Record> => {
  const user = await getCurrentUser();
  if (!user?.uid) {
    throw new Error("ユーザーが不正です。");
  }
  const docRef = doc(db, "users", userId, "records", recordId).withConverter(recordConverter);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error(`IDが${recordId}のレコードがありません。`);
  }
  return docSnap.data();
};

export const getRecordsList = async (recordsRef: Record[], queries: QueryConstraint[]) => {
  // Recordリストの参照を受け取って中身を追加する
  const user = await getCurrentUser();
  if (!user?.uid) {
    throw new Error("ユーザー認証がありません。");
  }
  const recordsQuery = query(
    collectionGroup(db, "records").withConverter(recordConverter),
    ...queries
  );
  const querySnapshot = await getDocs(recordsQuery);
  querySnapshot.forEach((doc) => {
    recordsRef.push(doc.data());
  });
};
