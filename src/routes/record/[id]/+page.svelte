<script lang="ts">
  import { getRecord } from "@/lib/records/get-record";
  import { getImageURL } from "@/lib/records/image";
  import type { PageData } from "./$types";

  export let data: PageData;

  const getTargetRecord = async () => {
    const result = await getRecord(data.id);
    if (!result) {
      throw new Error("データを読み込めませんでした。");
    }
    return result;
  };
</script>

{#await getTargetRecord()}
  <p>Loading...</p>
{:then record}
  <div class="info-container">
    <div class="grid-line" />
    <div class="who label">投稿者</div>
    <div class="who content">{record.who}</div>
    <div class="grid-line" />
    <div class="display-date label">時刻</div>
    <div class="display-date content">{record.getDate()}</div>
    <div class="grid-line" />
    <!-- TODO: データに実際の入力時刻をもたせる -->
    <div class="true-date label">入力時刻（試験機能）</div>
    <div class="true-date content">{record.getDate()}</div>
    <div class="grid-line" />
    <div class="type label">お世話の種類</div>
    <div class="type content">{record.getFullType()}</div>
    <div class="grid-line" />
    <div class="comment label">コメント</div>
    <div class="comment content">{record.comment}</div>
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
      {/if}
    </div>
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
  .error {
    color: red;
  }
  .error-back-link {
    text-decoration: underline;
  }
</style>
