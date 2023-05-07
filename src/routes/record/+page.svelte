<script lang="ts">
  import type {
    QueryCompositeFilterConstraint,
    QueryConstraint,
    QueryNonFilterConstraint,
  } from "@firebase/firestore";

  import type { Record } from "$lib/records";
  import { getRecordsList } from "$lib/records";

  import RecordInputBox from "@/components/records/RecordInputBox.svelte";
  import SearchQueryMaker from "@/components/records/SearchQueryMaker.svelte";
  import RecordsList from "@/components/records/RecordsList.svelte";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { getCurrentUser } from "@/settings/firebase";

  let records: Record[];
  $: records = [];
  let currentUserId = "";

  // ここでページ遷移ガードをしている.
  onMount(async () => {
    const user = await getCurrentUser();
    if (!user) {
      goto("/login?redirect=record");
    } else {
      currentUserId = user.uid;
    }
  });

  // レコードリストを取得. クエリメーカーで作成されたクエリを渡してもらう.
  const acquireList = async (
    orQuery: QueryCompositeFilterConstraint | null,
    remainderQueries: QueryNonFilterConstraint[]
  ) => {
    records = [];
    try {
      await getRecordsList(records, orQuery, remainderQueries);
    } catch (error) {
      console.log(error);
      alert("エラーが発生しました。\n" + error);
    }
    // svelteのリアクティブ変数反映のための自己代入
    records = records;
  };

  const addRecord = (ev: CustomEvent<{ addedRecord: Record }>) => {
    const addedRecord = ev.detail.addedRecord;
    records.splice(0, 0, addedRecord);
    records = records;
  };

  const deleteRecord = async (ev: CustomEvent<{ index: number }>) => {
    const index = ev.detail.index;
    records.splice(index, 1);
    records = records;
  };
</script>

<div class="records-view">
  <h4>入力</h4>
  <RecordInputBox on:record-added={addRecord} />
  <h4>検索</h4>
  <SearchQueryMaker fetchCallback={acquireList} />
  <h4>レコードリスト</h4>
  <div class="record-list-container">
    <RecordsList {records} {currentUserId} on:delete-record={deleteRecord} />
  </div>
</div>

<style>
  .records-view {
    margin: 0px 6rem;
  }
  @media (max-width: 1024px) {
    .records-view {
      margin: 0px 2%;
    }
  }
</style>
