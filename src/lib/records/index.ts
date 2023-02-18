import { recordTypeStrList, Record } from "./record";
import { recordConverter } from "./record-firestore-converter";
import { getOneRecord, getRecordsList } from "./get-record";
import { addRecordToFirestore } from "./add-record";
import { deleteRecordFromFirestore } from "./delete-record";

export {
  recordTypeStrList,
  addRecordToFirestore,
  getOneRecord,
  Record,
  recordConverter,
  getRecordsList,
  deleteRecordFromFirestore,
};
