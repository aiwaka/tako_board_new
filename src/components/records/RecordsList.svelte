<script lang="ts">
  import { deleteRecordFromFirestore, type Record } from "$lib/records";
  import RecordItem from "@/components/records/RecordItem.svelte";
  import { createEventDispatcher } from "svelte";

  export let records: Record[];

  const dispatch = createEventDispatcher();
  // emits: ["delete-record"],
  const deleteRecord = async (ev: CustomEvent<{ id: string }>) => {
    const id = ev.detail.id;
    if (confirm("削除しますか？")) {
      await deleteRecordFromFirestore(id);
      const index = records.findIndex((rec) => rec.id === id);
      if (index !== -1) {
        dispatch("delete-record", index);
      }
    }
  };
</script>

{#if records.length !== 0}
  <table class="record-table">
    <tbody>
      {#each records as record (record.id)}
        <RecordItem {record} on:delete-record={deleteRecord} />
      {/each}
      <!-- <record-row-vue
      v-for="record in records"
      :key="record.id"
      :data="record"
      @delete-record="deleteRecord"
    /> -->
    </tbody>
  </table>
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
    overflow-x: scroll;
    border-collapse: separate;
    border-spacing: 0px 30px;
  }
</style>
