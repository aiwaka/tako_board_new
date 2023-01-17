import { collectionGroup, getDocs, query, QueryConstraint } from "@firebase/firestore";
import { db, getCurrentUser } from "@/settings/firebase";

import type { Record } from "./record";
import { recordConverter } from "./record-firestore-converter";

export const getRecordsList = async (records_ref: Record[], queries: QueryConstraint[]) => {
  // Recordリストの参照を受け取って中身を追加する
  // fetch data from firestore
  const user = await getCurrentUser();
  if (!user?.uid) return;
  const recordsQuery = query(
    collectionGroup(db, "records").withConverter(recordConverter),
    ...queries
  );
  const querySnapshot = await getDocs(recordsQuery);
  querySnapshot.forEach((doc) => {
    records_ref.push(doc.data());
  });
};
