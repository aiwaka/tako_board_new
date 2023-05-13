<script lang="ts">
  import { recordTypeStrList, addRecordToFirestore, Record } from "$lib/records";
  import { uploadImageToFirebase } from "$lib/records/image";
  import { createEventDispatcher } from "svelte";

  import ArbitraryTimeInput from "./ArbitraryTimeInput.svelte";
  import ArrowIcon from "./ArrowIcon.svelte";
  import FileUploader from "./FileUploader.svelte";
  import { getPossibleTypeNumList } from "@/lib/records";
  import TypeTag from "./TypeTag.svelte";
  import ButtonUi from "@/components/ButtonUi.svelte";

  const dispatch = createEventDispatcher<{ "record-added": { addedRecord: Record } }>();

  // NOTE: ここではリスト内で選ぶことを「選択」, タイプを集合に入れることを「追加」, DBにレコードを入れることを「送信」と呼ぶ.
  $: arbitraryTimeActive = false;
  $: comment = "";
  let imageObj: File | null = null;
  $: imageObj = imageObj;
  $: recordTime = new Date();
  /** 現在選択されているタイプ番号 */
  $: selectedRecordTypeNum = -1;
  /** タイプ追加ボタンが有効かどうか */
  $: addTypeButtonDisabled = selectedRecordTypeNum === -1;
  /** 現在追加されているお世話タイプの集合 */
  $: currentRecordTypeNumSet = new Set<number>();
  /** 現在のタイプ番号セットに対して追加可能なタイプ番号のリスト */
  let possibleRecordTypeNumList: [string, boolean][] = [];
  $: possibleRecordTypeNumList = getPossibleTypeNumList(currentRecordTypeNumSet).map(
    (possibility, idx) => [recordTypeStrList[idx], possibility]
  );
  /** 現在追加されているお世話タイプの文字列の配列 */
  let currentRecordTypeList = [] as string[];
  $: currentRecordTypeList = Array.from(currentRecordTypeNumSet).map(
    (num) => recordTypeStrList[num]
  );
  // ペアが違反しているかどうかは送信時にチェックするのでここでは確認しないことにする.
  // TODO: チェックして
  $: sendButtonDisabled =
    currentRecordTypeNumSet.size === 0 ||
    currentRecordTypeNumSet.has(-1) ||
    (currentRecordTypeNumSet.has(0) && comment === "") ||
    (currentRecordTypeNumSet.has(8) && !currentRecordTypeNumSet.has(7) && comment === "");

  /** お世話タイプの集合に追加する */
  const addRecordType = () => {
    currentRecordTypeNumSet.add(selectedRecordTypeNum);
    currentRecordTypeNumSet = currentRecordTypeNumSet;
    selectedRecordTypeNum = -1;
  };
  const deleteTypeTag = (ev: CustomEvent<{ tagName: string }>) => {
    const tagName = ev.detail.tagName;
    const index = recordTypeStrList.findIndex((str) => str === tagName);
    currentRecordTypeNumSet.delete(index);
    currentRecordTypeNumSet = currentRecordTypeNumSet;
    selectedRecordTypeNum = -1;
  };

  const imageUploaded = (ev: CustomEvent<{ file: File }>) => {
    imageObj = ev.detail.file;
  };
  // 画像アップローダーを親側からリセットするためにバインドする変数.
  let resetFileUploader: () => void;
  const onUploaderReset = () => {
    imageObj = null;
  };

  /**
   * 任意時刻入力の有効フラグを書き換える. 整合性を保つためにフラグ反転ではなく代入にする.
   */
  const changeArbitTimeActiveState = (ev: CustomEvent<{ active: boolean }>) => {
    arbitraryTimeActive = ev.detail.active;
  };
  const inputTimeChanged = (ev: CustomEvent<{ datetime: Date }>) => {
    // 任意入力時刻が変更された場合に現在時刻を設定する.
    recordTime = ev.detail.datetime;
  };

  /**
   * このアプリの中核となる部分. 現在の入力状態を使ってレコードを追加する.
   */
  const addRecord = async (): Promise<void> => {
    // 画像がある場合は追加
    let imageName = "";
    if (imageObj !== null) {
      imageName = uploadImageToFirebase(imageObj);
    }
    try {
      const addedRecord = await addRecordToFirestore(
        currentRecordTypeNumSet,
        comment,
        arbitraryTimeActive ? recordTime : null,
        imageName
      );
      // 送信がなされたら今送ったものをリストに追加し, 各フォームをリセットする.
      dispatch("record-added", { addedRecord });
      // 入力後も任意時刻入力ボックスだけは閉じない. 連続して入力できるようにする.
      selectedRecordTypeNum = -1;
      currentRecordTypeNumSet = new Set();
      comment = "";
      imageObj = null;
      resetFileUploader();
    } catch (error) {
      console.log(error);
      alert(error);
      return;
    }
  };
</script>

<div class="record-input-container">
  <div class="record-input-form">
    <fieldset class="record-input">
      <label for="record-input--type">タイプ</label>
      <select id="record-input--type" name="record-type" bind:value={selectedRecordTypeNum}>
        <option value={-1}>---</option>
        {#each possibleRecordTypeNumList as [typeName, possible], index (typeName)}
          {#if possible}
            <option value={index}>{typeName}</option>
          {/if}
        {/each}
      </select>
      <ButtonUi on:click={addRecordType} disabled={addTypeButtonDisabled}>追加</ButtonUi>

      <label for="record-input--text">コメント</label>
      <input
        id="record-input--text"
        type="text"
        name="comment"
        placeholder="comment"
        bind:value={comment}
      />
    </fieldset>
    <div class="tag-list">
      {#each currentRecordTypeList as typeName (typeName)}
        <TypeTag name={typeName} on:delete-tag={deleteTypeTag} />
      {/each}
    </div>
    <!-- 任意時刻入力ボックス -->
    <ArbitraryTimeInput
      on:input-time-changed={inputTimeChanged}
      on:toggle-active={changeArbitTimeActiveState}
    />
    <!-- 画像追加コンテナ -->
    <FileUploader bind:resetFileUploader on:uploaded={imageUploaded} on:reset={onUploaderReset} />
  </div>
  <ArrowIcon active={!sendButtonDisabled} />
  <div class="add-button-container">
    <ButtonUi on:click={addRecord} disabled={sendButtonDisabled}>記録を追加</ButtonUi>
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
    margin: 0.4rem auto;
  }

  .record-input {
    display: grid;
    grid-template-rows: repeat(2, 2.1rem);
    grid-template-columns: 1fr 7.8rem 1fr;
    row-gap: 1.2rem;
    column-gap: 0.8rem;
    padding: 1.2rem 0.3rem;
    border: none;
  }
  .record-input label {
    line-height: 2.1rem;
  }
  .record-input input {
    color: inherit;
    border: 1px solid #777;
    transition: ease-in-out 0.2s;
  }
  .record-input input:focus {
    outline-width: 0;
    border-radius: 5px;
    background-color: rgba(128, 128, 128, 0.4);
  }
  .record-input input#record-input--text {
    grid-column: 2/4;
  }
  .record-input select {
    border: 1px solid #777;
    transition: ease-in-out 0.2s;
  }
  .tag-list {
    padding: 0.2rem 0.4rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
</style>
