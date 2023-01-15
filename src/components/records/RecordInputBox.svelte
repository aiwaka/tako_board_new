<script lang="ts">
  import { recordTypeStrList, addRecordToFirestore } from "$lib/records";
  import { uploadImageToFirebase } from "$lib/records/image";
  import { createEventDispatcher } from "svelte";

  import ArbitraryTimeInput from "./ArbitraryTimeInput.svelte";
  import ArrowIcon from "./ArrowIcon.svelte";
  import FileUploader from "./FileUploader.svelte";

  $: arbitraryTimeActive = false;
  $: comment = "";
  let imageObj: File | null = null;
  $: imageObj = imageObj;
  $: recordTime = new Date();
  $: recordType = -1;
  $: uploadStatus = { status: 0 };

  const dispatch = createEventDispatcher();

  // emits: ["record-added"],

  $: addButtonDisabled = recordType === -1 || (recordType === 0 && comment === "");

  const imageUploaded = (ev: CustomEvent<{ file: File }>) => {
    imageObj = ev.detail.file;
  };
  const deleteImage = () => {
    imageObj = null;
  };
  const onUploaderReset = () => {
    uploadStatus.status = 0;
  };

  const toggleArbitTimeActive = () => {
    arbitraryTimeActive = !arbitraryTimeActive;
  };
  const inputTimeChanged = (ev: CustomEvent<{ datetime: Date }>) => {
    // 任意入力時刻が変更された場合に現在時刻を設定する.
    recordTime = ev.detail.datetime;
  };

  /**
   * このアプリの中核となる部分. 現在の入力状態を使ってレコードを追加する.
   */
  const addRecord = async () => {
    // 画像がある場合は追加
    uploadStatus.status = 1;
    let imageName = "";
    if (imageObj !== null) {
      imageName = uploadImageToFirebase(imageObj);
    }
    const addedRecord = await addRecordToFirestore(
      +recordType, // +演算子で数値的な文字列を数値に変換する.
      comment,
      arbitraryTimeActive ? recordTime : null,
      imageName
    );
    if (addedRecord) {
      // 送信がなされたら今送ったものをリストに追加し, 各フォームをリセットする.
      dispatch("record-added", addedRecord);
      // 入力後も任意時刻入力ボックスを閉じない. 連続して入力できるようにする.
      recordType = -1;
      comment = "";
      imageObj = null;
      uploadStatus.status = 2;
    }
  };
</script>

<div class="record-input-container">
  <div class="record-input-form">
    <fieldset class="record-input">
      <label for="record-input--type">タイプ</label>
      <select id="record-input--type" name="record-type" bind:value={recordType}>
        <option value={-1}>---</option>
        {#each recordTypeStrList as recordTypeStr, index (recordTypeStr)}
          <option value={index}>{recordTypeStr}</option>
        {/each}
      </select>

      <label for="record-input--text">コメント</label>
      <input
        id="record-input--text"
        type="text"
        name="comment"
        placeholder="comment"
        bind:value={comment}
      />
    </fieldset>
    <!-- 任意時刻入力ボックス -->
    <ArbitraryTimeInput on:input-time-changed={inputTimeChanged} />
    <!-- <arbitrary-time-input-vue
      @input-time-changed="inputTimeChanged"
      @toggle-active="toggleArbitTimeActive"
    /> -->
    <!-- 画像追加コンテナ -->
    <FileUploader
      uploadWatcher={uploadStatus}
      on:uploaded={imageUploaded}
      on:reset={onUploaderReset}
    />
    <!-- <file-uploader-vue
      :uploadWatcher="uploadStatus"
      @uploaded="imageUploaded"
      @reset-finished="onUploaderReset"
    /> -->
  </div>
  <ArrowIcon active={!addButtonDisabled} />
  <div class="add-button-container">
    <button class="add-button" on:click={addRecord} disabled={addButtonDisabled}> 追加 </button>
  </div>
</div>

<style>
  .record-input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .record-input-form {
    padding: 0.5rem 0.2rem;
    width: 100%;
    border: 1px solid #777;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .add-button-container {
    margin: 0.5rem auto;
  }

  fieldset.record-input {
    display: grid;
    grid-template-rows: repeat(2, 2.1rem);
    grid-template-columns: 6rem 1fr;
    row-gap: 1.5rem;
    column-gap: 1rem;
    padding: 0.6rem 1.5rem;
    border: none;
  }
  fieldset.record-input input {
    color: inherit;
    border: 1px solid #777;
    transition: ease-in-out 0.2s;
  }
  fieldset.record-input input:focus {
    outline-width: 0;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.1);
  }

  fieldset.record-input select {
    border: 1px solid #777;
    transition: ease-in-out 0.2s;
  }
  fieldset.record-input input:focus {
    outline-width: 0;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
