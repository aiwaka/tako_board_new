import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/settings/firebase";
import { generateUuid4 } from "$lib/utils/uuid4";

/**
 * Firebaseのストレージにファイルをアップロードする. オブジェクトを渡すとその中に進行状況がセットされる.
 * @param imageFile 画像ファイルオブジェクト
 * @param uploadProgress `value`を持つオブジェクトを渡すと, アップロード状況がvalueとして利用可能.
 */
export const uploadImageToFirebase = (
  imageFile: File,
  uploadProgress: { value: number } | null = null
): string => {
  const randomFileName = generateUuid4() + "_" + imageFile.name;
  const imageRef = ref(storage, "images/" + randomFileName);

  const uploadTask = uploadBytesResumable(imageRef, imageFile);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const percentage =
        Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 10000) / 100;
      if (uploadProgress !== null) {
        uploadProgress.value = percentage;
      }
    },
    (err) => {
      // エラー処理
      console.log(err);
      alert("ファイルのアップロードに失敗しました。");
    },
    () => {
      // 終了処理
      getDownloadURL(uploadTask.snapshot.ref).then(() => {
        // console.log("File available at", downloadURL);
      });
    }
  );
  return randomFileName;
};
