import type { QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "@firebase/firestore";
import { Record } from "./record";

export const recordConverter = {
  toFirestore: (record: Record): DocumentData => {
    return {
      type: record.type,
      userId: record.userId,
      comment: record.comment,
      name: record.who,
      date: record.date,
      actualDate: record.actualDate,
      imageName: record.imageName,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Record => {
    const data = snapshot.data(options);
    return new Record(
      snapshot.id,
      data.userId,
      data.name,
      data.type,
      data.date,
      // actualDateが存在しない場合は表示時刻をそれとして扱う.
      data.actualDate === undefined ? data.date : data.actualDate,
      data.comment,
      // imageNameは後から追加した属性なので, undefinedである可能性がある.
      data.imageName === undefined ? null : data.imageName
    );
  },
};
