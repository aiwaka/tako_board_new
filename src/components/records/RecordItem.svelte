<script lang="ts">
  import { getCurrentUser } from "@/settings/firebase";
  import type { Record } from "$lib/records";
  import ModalWindow from "@/components/ModalWindow.svelte";
  import { createEventDispatcher, onMount } from "svelte";

  $: deleteDisabled = true;
  $: showWholeComment = false;
  export let record: Record;

  const dispatch = createEventDispatcher();

  const OMIT_THRESHOLD = 8; // コメント文字列を省略する文字数の閾値

  onMount(async () => {
    const user = await getCurrentUser();
    const uid = user?.uid;
    if (uid) {
      deleteDisabled = uid !== record.userId;
    }
  });

  // emits: ["delete-record"],

  $: commentIsLong = record.comment.length > OMIT_THRESHOLD;
  $: shortComment = record.comment.substring(0, OMIT_THRESHOLD) + "...";

  const toggleShowComment = () => (showWholeComment = !showWholeComment);
  const deleteRecord = () => dispatch("delete-record", record.id);
</script>

<tr class="record">
  <td class="who">{record.who}</td>
  <td class="date">{record.getDate()}</td>
  <td class="type">{record.getType()}</td>
  <td class="comment">
    <button on:click={toggleShowComment}>
      {#if commentIsLong && !showWholeComment}
        {shortComment}
      {:else}
        {record.comment}
      {/if}
    </button>
  </td>
  <td class="image">
    {#if record.imageName}
      <p>
        <ModalWindow imageName={record.imageName}>画像あり</ModalWindow>
        <!-- <modal-window-vue :image-name="data.imageName">画像あり</modal-window-vue> -->
      </p>
    {/if}
  </td>
  <td class="button">
    <button disabled={deleteDisabled} on:click={deleteRecord}>x</button>
  </td>
</tr>

<style>
  tr.record {
    width: 100%;
  }
  tr.record > td {
    width: 200px;
    max-width: 22%;
  }
  tr.record > td.comment {
    max-width: 35%;
    width: 300px;
  }
  tr.record > td.button {
    max-width: 10%;
    width: 3rem;
  }
</style>
