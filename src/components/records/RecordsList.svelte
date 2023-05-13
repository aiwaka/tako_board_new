<script lang="ts">
  import { deleteRecordFromFirestore, type Record } from "$lib/records";
  import RecordItem from "@/components/records/RecordItem.svelte";
  import { createEventDispatcher } from "svelte";

  export let records: Record[];
  export let currentUserId: string;

  const dispatch = createEventDispatcher<{ "delete-record": { index: number } }>();

  const deleteRecord = async (ev: CustomEvent<{ id: string }>) => {
    const id = ev.detail.id;
    if (confirm("削除しますか？")) {
      try {
        await deleteRecordFromFirestore(id);
      } catch (error) {
        console.error(error);
        alert("エラーが発生しました。\n" + error);
        return;
      }
      const index = records.findIndex((rec) => rec.id === id);
      if (index !== -1) {
        dispatch("delete-record", { index });
      }
    }
  };
</script>

{#if records.length !== 0}
  <div class="record-table">
    {#each records as record (record.id)}
      <RecordItem {record} {currentUserId} on:delete-record={deleteRecord} />
    {/each}
  </div>
{:else}
  <div>
    <span>レコードがありません</span>
  </div>
{/if}

<style>
  .record-table {
    width: 90%;
    height: auto;
    margin: 0.4rem auto;
    display: grid;
    grid-template-columns: repeat(4, auto) 2rem 2rem;
    grid-auto-rows: auto;
    place-items: center;
    row-gap: 1rem;
  }
</style>
