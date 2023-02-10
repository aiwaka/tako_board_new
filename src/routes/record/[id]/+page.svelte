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
    <div class="grid-line" />
    <div class="who label">投稿者</div>
    <div class="who content">{record.who}</div>
    <div class="grid-line" />
    <div class="display-date label">時刻</div>
    <div class="display-date content">{record.getDate()}</div>
    <div class="grid-line" />
    <!-- TODO: データに実際の入力時刻をもたせる -->
    <div class="true-date label">入力時刻</div>
    <div class="true-date content">{record.getDate()}</div>
    <div class="grid-line" />
    <div class="type label">お世話の種類</div>
    <div class="type content">{record.getFullType()}</div>
    <div class="grid-line" />
    <div class="comment label">コメント</div>
    <div class="comment content">{record.comment}</div>
    <div class="grid-line" />
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
  .label {
    color: #777;
    font-size: 0.85rem;
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
</style>
