import { collectionGroup, getDocs, query, QueryConstraint } from "@firebase/firestore";
import { db, getCurrentUser } from "@/settings/firebase";

import type { Record } from "./record";
import { recordConverter } from "./record-firestore-converter";

export const getRecordsList = (
  records_ref: Record[],
  queries: QueryConstraint[]
): (() => Promise<void>) => {
  // Recordリストの参照を受け取って中身を追加する
  const getRecordsList = async () => {
    // fetch data from firestore
    const user = await getCurrentUser();
    const uid = user?.uid;
    if (!uid) return;
    const recordsQuery = query(
      collectionGroup(db, "records").withConverter(recordConverter),
      ...queries
    );
    const querySnapshot = await getDocs(recordsQuery);
    querySnapshot.forEach((doc) => {
      records_ref.push(doc.data());
    });
  };
  return getRecordsList;
};
