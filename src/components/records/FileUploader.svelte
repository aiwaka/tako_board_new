<script lang="ts">
  import { createEventDispatcher } from "svelte";

  $: uploadedImageUrl = "";
  export let uploadWatcher: { status: number };

  const dispatch = createEventDispatcher();

  // emits: ["uploaded", "reset-finished"],

  $: {
    uploadWatcher;
  }

  // watch(uploadWatcher, (status, prevStatus) => {
  //   // statusが実行中から終了に変化したら画像を消去する.
  //   if (prevStatus === 1 && status == 2) {
  //     reset();
  //   }
  // });

  const reset = () => {
    uploadedImageUrl = "";
    dispatch("reset");
    // context.emit("reset-finished");
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
  <div>
    <label for="image-uploader">添付画像</label>
    <input
      name="image-uploader"
      class="image-uploader"
      type="file"
      accept="image/*"
      on:change={onImageUpload}
    />
  </div>
  {#if uploadedImageUrl !== ""}
    <img class="image-preview" src={uploadedImageUrl} alt="upload-preview" />
  {/if}

  <!-- <div class="progress-container" v-if="uploadStatus == 1">
      <div class="progress-bar-container">
        <div
          class="progress-bar"
          :style="{ width: String(uploadProgress) + '%' }"
        ></div>
      </div>
      <p>{{ uploadProgress }}%</p>
    </div> -->
</div>

<style>
  .image-uploader-container {
    margin: 0.2rem auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .image-preview {
    border: 2px solid #777777;
    width: 13rem;
  }
  /* .progress-container {
    width: 25%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .progress-bar-container {
    width: 70%;
  }
  .progress-bar {
    width: 100%;
    height: 0.3rem;
    background-color: #42b983;
    transition: 0.1s;
  } */
</style>
