import { storage } from "@/settings/firebase";
import { deleteObject, ref } from "firebase/storage";

export const deleteImageFromFirebase = async (
  filename: string
): Promise<void> => {
  const fileRef = ref(storage, `images/${filename}`);
  deleteObject(fileRef);
};
