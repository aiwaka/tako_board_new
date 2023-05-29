<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";
  import {
    type Record,
    deleteRecordFromFirestore,
    getOneRecord,
    updateOneRecord,
    type RecordUpdateData,
  } from "$lib/records";
  import { getImageURL } from "$lib/records/image";
  import { getCurrentUser } from "@/settings/firebase";
  import ButtonUi from "@/components/ButtonUi.svelte";

  export let data: PageData;

  let currentUserId = "";
  onMount(async () => {
    const user = await getCurrentUser();
    if (user) {
      currentUserId = user.uid;
    }
  });

  $: modifying = false;
  $: newComment = "";

  const startToModifyRecord = (old: Record) => {
    newComment = old.comment;
    modifying = true;
  };
  const modifyRecord = async (old: Record) => {
    if (confirm("修正しますか？")) {
      const payload: RecordUpdateData = {};
      if (newComment !== old.comment) {
        payload["comment"] = newComment;
      }
      try {
        await updateOneRecord(currentUserId, data.recordId, payload);
        Object.assign(old, payload);
      } catch (e) {
        alert(e);
        console.log(e);
      }
      modifying = false;
    }
  };

  const deleteRecord = async () => {
    if (confirm("この記録を削除しますか？")) {
      try {
        await deleteRecordFromFirestore(data.recordId);
      } catch (error) {
        console.error(error);
        alert("エラーが発生しました。\n" + error);
        return;
      }
      goto("/record");
    }
  };
</script>

{#await getOneRecord(data.userId, data.recordId)}
  <p>Loading...</p>
{:then record}
  <div class="info-container">
    <div class="grid-line" />
    <div class="user-name label">投稿者</div>
    <div class="user-name content">{record.userName}</div>
    <div class="grid-line" />
    <div class="display-date label">時刻</div>
    <div class="display-date content">{record.getDisplayDate()}</div>
    <div class="grid-line" />
    <div class="true-date label">入力時刻</div>
    <div class="true-date content">{record.getActualDate()}</div>
    <div class="grid-line" />
    <div class="type label">お世話の種類</div>
    <div class="type content">{record.getTypeStr({ full: true })}</div>
    <div class="grid-line" />
    <div class="comment label">コメント</div>
    {#if modifying}
      <div class="comment content">
        <textarea
          id="modify-form-comment"
          name="comment"
          placeholder="new comment"
          bind:value={newComment}
        />
      </div>
    {:else}
      <div class="comment content">{record.comment}</div>
    {/if}
    <div class="grid-line" />
    <div class="image">
      {#if record.imageName}
        {#await getImageURL(record.imageName)}
          <p>Image Loading...</p>
        {:then imageURL}
          <img class="image" src={imageURL} alt="レコードの添付画像" />
        {:catch e}
          <div>画像を読み込めませんでした。</div>
          <div>{e}</div>
        {/await}
        <div class="grid-line" />
      {/if}
    </div>
    {#if currentUserId === record.userId}
      <div class="delete-button-container">
        <ButtonUi alertFlag={true} on:click={deleteRecord}>この記録を削除</ButtonUi>
      </div>
      <div class="delete-button-container">
        {#if modifying}
          <ButtonUi on:click={() => (modifying = false)}>キャンセル</ButtonUi>
          <ButtonUi alertFlag={true} on:click={() => modifyRecord(record)}>修正する</ButtonUi>
        {:else}
          <ButtonUi on:click={() => startToModifyRecord(record)}>この記録を修正</ButtonUi>
        {/if}
      </div>
    {/if}
  </div>
{:catch error}
  <div class="error">{error}</div>
  <a class="error-back-link" href="/record">RECORDへ戻る</a>
{/await}

<style>
  .info-container {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 7fr;
    column-gap: 1.8rem;
    row-gap: 0.8rem;
  }
  .label {
    padding-left: 0.7rem;
    color: #777;
    font-size: 0.85rem;
  }
  .content {
    padding-left: 0.8rem;
  }
  .grid-line {
    grid-column: 1 / 3;
    height: 1px;
    border-top: 1px solid #bbb;
  }
  .image {
    grid-column: 1 / 3;
  }
  @media (max-width: 1024px) {
    .info-container {
      grid-template-columns: 1fr;
    }
    .grid-line {
      grid-column: 1 / 2;
    }
    .image {
      grid-column: 1 / 2;
    }
  }
  textarea {
    width: 100%;
  }
  .error {
    color: red;
  }
  .error-back-link {
    text-decoration: underline;
  }
</style>
