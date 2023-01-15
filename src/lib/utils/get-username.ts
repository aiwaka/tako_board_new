import { doc, getDoc } from "@firebase/firestore";
import { db, getCurrentUser } from "@/settings/firebase";

export const getUserName = async (): Promise<string | null> => {
  const user = await getCurrentUser();
  const uid = user?.uid;
  if (!uid) {
    return null;
  }
  const recordsRef = doc(db, "users", uid);
  const userSnap = await getDoc(recordsRef);
  if (!userSnap.exists()) return null;
  return userSnap.data().name as string;
};
