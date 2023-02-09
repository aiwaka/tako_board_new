<script lang="ts">
  import type { Record } from "@/lib/records";
  import { getRecord } from "@/lib/records/get-record";
  import { getImageURL } from "@/lib/records/image";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let record: Record | null;
  $: record = null;
  let imageURL: string | null;
  $: imageURL = null;
  onMount(async () => {
    // URLパラメータがレコードidになっているのでこれを使ってデータ取得
    const result = await getRecord(data.id);
    if (result) {
      record = result;
    }
    if (record !== null) {
      // レコードが存在する場合は画像が存在するかどうか確認する. あれば取得する.
      const imageName = record.imageName;
      if (imageName) {
        imageURL = await getImageURL(imageName);
      }
    }
  });
</script>

{#if record !== null}
  <div class="info-container">
    <div class="who label">投稿者</div>
    <div class="who content">{record.who}</div>
    <div class="view-date label">時刻</div>
    <div class="view-date content">{record.getDate()}</div>
    <div class="true-date label">入力時刻</div>
    <div class="true-date content">{record.getDate()}</div>
    <div class="type label">お世話の種類</div>
    <div class="type content">{record.getType()}</div>
    <div class="comment label">コメント</div>
    <div class="comment content">{record.comment}</div>
    <div class="image">
      {#if imageURL !== null}
        <img class="image" src={imageURL} alt="レコードの添付画像" />
      {/if}
    </div>
  </div>
{:else}
  <p>No Data</p>
{/if}

<style>
  .info-container {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 7fr;
    column-gap: 1.8rem;
    row-gap: 0.8rem;
  }
  .image {
    grid-column: 1 / 3;
  }
</style>
