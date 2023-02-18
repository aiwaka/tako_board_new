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
      await deleteRecordFromFirestore(id);
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
    /* overflow-x: scroll; */
    margin: 0.4rem auto;
    display: grid;
    grid-template-columns: repeat(4, auto) 2rem 2rem;
    grid-auto-rows: 4rem;
    place-items: center;
    /* border-collapse: separate; */
    /* border-spacing: 0px 30px; */
  }
</style>
