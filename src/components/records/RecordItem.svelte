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

  const dispatch = createEventDispatcher<{ "delete-record": { id: string } }>();

  const OMIT_THRESHOLD = 8; // コメント文字列を省略する文字数の閾値

  $: commentIsLong = record.comment.length > OMIT_THRESHOLD;
  $: shortComment = record.comment.substring(0, OMIT_THRESHOLD) + "...";

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
<div class="type">{record.getType()}</div>
<div class="comment">
  <button class="comment-column-button" on:click={toggleShowComment}>
    {#if commentIsLong && !showWholeComment}
      {shortComment}
    {:else}
      {record.comment}
    {/if}
  </button>
</div>
<div class="image">
  {#if record.imageName}
    <ModalWindow imageName={record.imageName}><ImageIcon /></ModalWindow>
  {/if}
</div>
<div class="delete-button">
  <button disabled={deleteDisabled} on:click={deleteRecord}>
    <CrossIcon disabled={deleteDisabled} />
    <!-- <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      style="width: 16px; height: 16px; opacity: 1;"
      xml:space="preserve"
    >
      <g>
        <polygon
          points="512,52.535 459.467,0.002 256.002,203.462 52.538,0.002 0,52.535 203.47,256.005 0,459.465
          52.533,511.998 256.002,308.527 459.467,511.998 512,459.475 308.536,256.005"
          style={`fill: ${deleteDisabled ? "gray" : "var(--main-font-color)"};`}
        />
      </g>
    </svg> -->
  </button>
</div>

<style>
  .comment-column-button {
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
