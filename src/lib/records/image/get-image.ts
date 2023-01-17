import { storage } from "@/settings/firebase";
import { getDownloadURL, ref } from "firebase/storage";

/**
 * Firebase storageのファイルを指定するURLを取得する.
 * @param filename Firebaseのstorageに保存されているファイル名.
 * @return ファイルを指すURL.
 */
export const getImageURL = async (filename: string): Promise<string> => {
  const fileRef = ref(storage, `images/${filename}`);
  const url = await getDownloadURL(fileRef);
  return url;
};
