import { storage } from "@/settings/firebase";
import { deleteObject, ref } from "firebase/storage";

export const deleteImageFromFirebase = (filename: string) => {
  const fileRef = ref(storage, `images/${filename}`);
  return deleteObject(fileRef);
};
