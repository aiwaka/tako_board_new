<script lang="ts">
  import { recordTypeStrList, addRecordToFirestore, Record } from "$lib/records";
  import { uploadImageToFirebase } from "$lib/records/image";
  import { createEventDispatcher } from "svelte";

  import ArbitraryTimeInput from "./ArbitraryTimeInput.svelte";
  import ArrowIcon from "./ArrowIcon.svelte";
  import FileUploader from "./FileUploader.svelte";
  import { possibleTypePairAdjacencyMatrix } from "@/lib/records/record";
  import TypeTag from "./TypeTag.svelte";
  import ButtonUi from "@/components/ButtonUi.svelte";

  $: arbitraryTimeActive = false;
  $: comment = "";
  let imageObj: File | null = null;
  $: imageObj = imageObj;
  $: recordTime = new Date();
  $: recordType = -1;
  /** 現在選択されているお世話タイプの集合 */
  $: recordTypeNumStore = new Set<number>();

  const dispatch = createEventDispatcher<{ "record-added": { addedRecord: Record } }>();

  /**
   * 組み合わせられる番号でtrueとなる配列を返す.
   * @param numSet 番号のリスト
   */
  const getPossibleTypeNumList = (numSet: Set<number>) => {
    // 集合が空の場合すべてtrueとなるのでOK.
    const result = possibleTypePairAdjacencyMatrix.map(() => true);
    for (const num of numSet) {
      for (let i = 0; i < result.length; i++) {
        // 一つでもfalseなら最終的にfalseになる
        result[i] &&= possibleTypePairAdjacencyMatrix[num][i];
      }
    }
    return result;
  };
  /** タイプ追加ボタンが有効かどうか */
  $: addTypeButtonDisabled = recordType === -1;
  let possibleRecordTypeList: [string, boolean][] = recordTypeStrList.map((value) => [value, true]);
  /** 現在選択されているお世話タイプのリストを示す文字列配列 */
  let storedRecordTypeList = [] as string[];
  /** お世話タイプの集合に追加する */
  const addRecordType = () => {
    recordTypeNumStore.add(recordType);
    recordTypeNumStore = recordTypeNumStore;
    const possibleTypeNumList = getPossibleTypeNumList(recordTypeNumStore);
    possibleRecordTypeList = recordTypeStrList.map((value, i) => [value, possibleTypeNumList[i]]);
    recordType = -1;
  };
  const deleteTypeTag = (ev: CustomEvent<{ tagName: string }>) => {
    const tagName = ev.detail.tagName;
    const index = recordTypeStrList.findIndex((str) => str === tagName);
    recordTypeNumStore.delete(index);
    recordTypeNumStore = recordTypeNumStore;
    const possibleTypeNumList = getPossibleTypeNumList(recordTypeNumStore);
    possibleRecordTypeList = recordTypeStrList.map((value, i) => [value, possibleTypeNumList[i]]);
    recordType = -1;
  };
  // ペアが違反しているかどうかは送信時にチェックするのでここでは確認しないことにする.
  $: sendButtonDisabled =
    recordTypeNumStore.size === 0 ||
    recordTypeNumStore.has(-1) ||
    (recordTypeNumStore.has(0) && comment === "") ||
    (recordTypeNumStore.has(8) && !recordTypeNumStore.has(7) && comment === "");
  $: {
    storedRecordTypeList.splice(0);
    for (const num of recordTypeNumStore) {
      storedRecordTypeList.push(recordTypeStrList[num]);
    }
    storedRecordTypeList = storedRecordTypeList;
  }

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
        recordTypeNumStore,
        comment,
        arbitraryTimeActive ? recordTime : null,
        imageName
      );
      // 送信がなされたら今送ったものをリストに追加し, 各フォームをリセットする.
      dispatch("record-added", { addedRecord });
      // 入力後も任意時刻入力ボックスだけは閉じない. 連続して入力できるようにする.
      recordType = -1;
      recordTypeNumStore = new Set();
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
      <select id="record-input--type" name="record-type" bind:value={recordType}>
        <option value={-1}>---</option>
        {#each possibleRecordTypeList as [typeName, possible], index (typeName)}
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
      {#each storedRecordTypeList as typeName (typeName)}
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
