<script lang="ts">
  import type { Record } from "$lib/records";
  import ModalWindow from "@/components/ModalWindow.svelte";
  import { createEventDispatcher } from "svelte";
  import ImageIcon from "../ImageIcon.svelte";
  import CrossIcon from "../svg/CrossIcon.svelte";

  export let record: Record;
  export let currentUserId: string;

  $: deleteDisabled = currentUserId !== record.userId;
  $: showWholeComment = false;
  $: showWholeTypeStr = false;

  const dispatch = createEventDispatcher<{ "delete-record": { id: string } }>();

  const COMMENT_OMIT_THRESHOLD = 8 as const; // コメント文字列を省略する文字数の閾値
  const TYPE_OMIT_THRESHOLD = 8 as const; // タイプ文字列を省略する文字数の閾値

  $: typeStrIsLong = record.getTypeStr().length > TYPE_OMIT_THRESHOLD;
  $: shortTypeStr = record.getTypeStr({ threshold: TYPE_OMIT_THRESHOLD }) + ", 他";
  $: commentIsLong = record.comment.length > COMMENT_OMIT_THRESHOLD;
  $: shortComment = record.comment.substring(0, COMMENT_OMIT_THRESHOLD) + "...";

  const toggleShowTypeStr = () => (showWholeTypeStr = !showWholeTypeStr);
  const toggleShowComment = () => (showWholeComment = !showWholeComment);
  const deleteRecord = () => dispatch("delete-record", { id: record.id });
</script>

<div class="who">
  <!-- TODO: ユーザーIDを見るのは容易ではあるがリンクに含めるのも変な気がする. 他のやり方を考える. -->
  <a href={`/record/${record.userId}-${record.id}`}>
    {record.userName}
  </a>
</div>
<div class="date">{record.getDisplayDate()}</div>
<div class="type">
  {#if typeStrIsLong}
    <button class="toggle-folding-button" on:click={toggleShowTypeStr}>
      {#if !showWholeTypeStr}
        {shortTypeStr}
      {:else}
        {record.getTypeStr()}
      {/if}
    </button>
  {:else}
    {record.getTypeStr()}
  {/if}
</div>
<div class="comment">
  {#if commentIsLong}
    <button class="toggle-folding-button" on:click={toggleShowComment}>
      {#if !showWholeComment}
        {shortComment}
      {:else}
        {record.comment}
      {/if}
    </button>
  {:else}
    {record.comment}
  {/if}
</div>
<div class="image">
  {#if record.imageName}
    <ModalWindow imageName={record.imageName}><ImageIcon /></ModalWindow>
  {/if}
</div>
<div class="delete-button">
  <button disabled={deleteDisabled} on:click={deleteRecord}>
    <CrossIcon disabled={deleteDisabled} />
  </button>
</div>

<style>
  .toggle-folding-button {
    border: none;
    background: transparent;
  }
  .delete-button {
    margin: auto;
    width: 1rem;
    height: 1rem;
  }
  .delete-button > button {
    width: 1rem;
    height: 1rem;
    /* border: 1px solid #888; */
    border: none;
  }
</style>
