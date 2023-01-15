<script lang="ts">
  import { endAt, orderBy, startAt, QueryConstraint, where } from "@firebase/firestore";
  import { toDateString } from "$lib/utils";

  import { recordTypeStrList } from "$lib/records";
  import { onMount } from "svelte";
  import DatePicker from "./DatePicker.svelte";
  // import DateSelectorVue from "@/components/DateSelector.vue";

  const today = new Date();
  const tempToday = new Date();
  const prevWeekDay = new Date(tempToday.setDate(tempToday.getDate() - 7));

  $: endDate = toDateString(today);
  $: startDate = toDateString(prevWeekDay);
  $: boxOpening = false;
  $: fetchButtonDisabled = true;
  $: recordType = "-1";

  export let fetchCallback: (queries: QueryConstraint[]) => Promise<void>;

  onMount(() => fetch());

  const toggleBoxOpening = () => (boxOpening = !boxOpening);

  const fetch = async () => {
    // 取得時期期間, 検索条件等を総合したクエリを作成し, propsで受け取っているコールバックに渡しながら実行
    // 降順の場合startとendが逆になる.
    const queries: QueryConstraint[] = [
      orderBy("date", "desc"),
      endAt(new Date(startDate)),
      startAt(new Date(endDate)),
    ];
    if (recordType !== "-1") {
      queries.push(where("type", "==", parseInt(recordType)));
    }
    fetchButtonDisabled = true;
    await fetchCallback(queries);
  };

  // 表示日が初期状態から変更された場合, レコード再取得ボタンを有効化する.
  const endDateChanged = (event: CustomEvent<{ endDate: string }>) => {
    endDate = event.detail.endDate;
    recordTypeChanged();
  };
  const startDateChanged = (event: CustomEvent<{ startDate: string }>) => {
    startDate = event.detail.startDate;
    recordTypeChanged();
  };
  const recordTypeChanged = () => {
    fetchButtonDisabled = false;
  };
</script>

<!-- Firestore検索クエリを作成し取得ボタンを押したらコールバックに渡すコンポーネント -->
<div class="query-maker">
  {#if !boxOpening}
    <button class="toggle-button" on:click={toggleBoxOpening}>+</button>
    <span>検索ボックス</span>
  {:else}
    <button class="toggle-button" on:click={toggleBoxOpening}>-</button>
    <div class="input-box">
      <h4>期間指定</h4>
      <DatePicker on:end-date-changed={endDateChanged} on:start-date-changed={startDateChanged} />
      <div>
        <h4>タイプ指定</h4>
        <select name="query-record-type" bind:value={recordType} on:change={recordTypeChanged}>
          <option value="-1">---</option>
          <!-- valueをバインドする際は-1に合わせるためstringに変換している. -->
          {#each recordTypeStrList as recordTypeStr, index (recordTypeStr)}
            <option value={"" + index}>{recordTypeStr}</option>
          {/each}
        </select>
      </div>
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
  .toggle-button {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    line-height: 1rem;
    border: 1px solid #000000;
    cursor: pointer;
  }
  span {
    margin: 0 0.5rem;
  }
  h4 {
    margin: auto;
  }
  .search-execute {
    margin-top: 0.6rem;
  }
</style>
