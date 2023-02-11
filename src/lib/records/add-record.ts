import { collection, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db, getCurrentUser } from "@/settings/firebase";
import { Record } from "./record";
import { recordConverter } from "./record-firestore-converter";

export const addRecordToFirestore = async (
  type: number,
  comment: string,
  inputTime: Date | null = null,
  imageName = ""
): Promise<Record | null> => {
  if (type === -1) {
    alert("レコードタイプを選んでください.");
    return null;
  } else if (type === 0 && comment === "") {
    alert("コメントのみを送る場合はコメントが必須です。");
  }
  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) {
    return null;
  }
  const recordsRef = doc(db, "users", uid);
  const userSnap = await getDoc(recordsRef);
  if (!userSnap.exists()) return null;
  const userName: string = userSnap.data().name;
  const newRecordRef = doc(collection(recordsRef, "records").withConverter(recordConverter));
  const actualTime = Timestamp.now();
  // 時刻が指定されているならそれを用い, そうでなければ現在時刻を取得して用いる.
  const recordTime = inputTime ? Timestamp.fromDate(inputTime) : Timestamp.now();

  // refを作成した時点でidは生成されているのでそれを使う.
  const newRecordData = new Record(
    newRecordRef.id,
    uid,
    userName,
    type,
    recordTime,
    actualTime,
    comment,
    imageName
  );
  await setDoc(newRecordRef, newRecordData);
  // 今作成したオブジェクトを返すことでリロードなしで使えるようにする.
  return newRecordData;
};
