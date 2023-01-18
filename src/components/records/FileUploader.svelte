<script lang="ts">
  import { createEventDispatcher } from "svelte";

  $: uploadedImageUrl = "";
  let fileList: FileList | null;
  $: fileList = null;
  // 親側からリセットするための関数
  export const resetFileUploader = () => {
    reset();
  };

  const dispatch = createEventDispatcher();

  const reset = () => {
    uploadedImageUrl = "";
    dispatch("reset");
  };

  // アップロードした画像を表示
  const createImagePreview = (file: File) => {
    if (file === undefined) {
      reset();
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        uploadedImageUrl = String(event.target.result);
      }
    };
    reader.onabort = () => {
      reader.abort();
      reset();
      return;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const onImageUpload = (event: Event) => {
    // アップロード動作をしたとき
    const target = event.target as HTMLInputElement;
    if (target.files === null) return;
    const uploadedFile = target.files[0];
    createImagePreview(uploadedFile);
    dispatch("uploaded", { file: uploadedFile });
  };
</script>

<div class="image-uploader-container">
  <label for="image-uploader">添付画像</label>
  <input
    name="image-uploader"
    class="image-uploader"
    type="file"
    bind:files={fileList}
    accept="image/*"
    on:change={onImageUpload}
  />
  {#if uploadedImageUrl !== ""}
    <img class="image-preview" src={uploadedImageUrl} alt="upload-preview" />
  {/if}
</div>

<style>
  .image-uploader-container {
    margin: 0.2rem auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .image-uploader {
    font-size: 0.9rem;
  }
  .image-preview {
    border: 2px solid #777777;
    width: 13rem;
  }
</style>
