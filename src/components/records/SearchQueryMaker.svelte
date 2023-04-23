<script lang="ts">
  import { endAt, orderBy, startAt, QueryConstraint, where } from "@firebase/firestore";
  import { toDateString } from "$lib/utils";

  import { recordTypeStrList } from "$lib/records";
  import { onMount } from "svelte";
  import ToggleButton from "../ToggleButton.svelte";

  const today = new Date();
  // setDateはオブジェクトを変更するので適当な変数をつくる
  const tempToday = new Date();
  const prevWeekDay = new Date(tempToday.setDate(tempToday.getDate() - 7));

  $: endDateStr = toDateString(today);
  $: endDateTomorrowStr = "";
  $: {
    const endDate = new Date(endDateStr);
    const endDateTomorrow = new Date(endDate.setDate(endDate.getDate() + 1));
    endDateTomorrowStr = toDateString(endDateTomorrow);
  }
  $: startDateStr = toDateString(prevWeekDay);

  $: active = false;
  $: fetchButtonDisabled = true;
  $: recordType = -1;

  export let fetchCallback: (queries: QueryConstraint[]) => Promise<void>;

  onMount(() => fetch());

  const toggleActive = () => (active = !active);

  const fetch = async () => {
    // 取得時期期間, 検索条件等を総合したクエリを作成し, 受け取っているコールバックに渡しながら実行する.
    // 文字列をDateオブジェクトにすると9時になってしまうので, 時間を0にセットしている.
    // 降順の場合startとendが逆になる.
    const startDate = new Date(startDateStr);
    startDate.setHours(0);
    const endDateTomorrow = new Date(endDateTomorrowStr);
    endDateTomorrow.setHours(0);
    const queries: QueryConstraint[] = [
      orderBy("date", "desc"),
      endAt(startDate),
      startAt(endDateTomorrow),
    ];
    if (recordType !== -1) {
      queries.push(where("type", "==", recordType));
    }
    fetchButtonDisabled = true;
    await fetchCallback(queries);
  };

  const enableFetchButton = () => (fetchButtonDisabled = false);
</script>

<!-- Firestore検索クエリを作成し取得ボタンを押したらコールバックに渡すコンポーネント -->
<div class="query-maker">
  <ToggleButton {active} on:click={toggleActive} />
  {#if !active}
    <span>検索ボックス</span>
  {:else}
    <div class="input-box">
      <h4>期間指定</h4>
      <div class="date-selector">
        <input type="date" bind:value={startDateStr} on:change={enableFetchButton} />
        から
        <input type="date" bind:value={endDateStr} on:change={enableFetchButton} />
      </div>

      <h4>タイプ指定</h4>
      <select name="query-record-type" bind:value={recordType} on:change={enableFetchButton}>
        <option value={-1}>---</option>
        {#each recordTypeStrList as recordTypeStr, index (recordTypeStr)}
          <option value={index}>{recordTypeStr}</option>
        {/each}
      </select>

      <button class="search-execute" on:click|preventDefault={fetch} disabled={fetchButtonDisabled}>
        取得
      </button>
    </div>
  {/if}
</div>

<style>
  .query-maker {
    border: 1px solid #777777;
    margin: 0.2rem auto 2.8rem;
    padding: 1rem 0.6rem;
  }
  span {
    margin: 0 0.5rem;
  }
  h4 {
    margin: 1.5rem auto;
  }
  .input-box {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .search-execute {
    margin-top: 0.6rem;
    padding: 0.1rem 0.1rem;
    border: 2px solid #777;
    border-radius: 4px;
  }
  .date-selector {
    display: flex;
    justify-content: center;
  }
  .date-selector > input {
    margin: auto 15px;
  }
</style>
