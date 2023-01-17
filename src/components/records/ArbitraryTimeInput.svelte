<script lang="ts">
  // NOTE: 2023/1/16 SveltyPickerはいい感じだったがバインドにバグがありそう（REPLも動いていなかった）
  import { createEventDispatcher } from "svelte";
  import ToggleButton from "../ToggleButton.svelte";

  $: active = false;
  // 任意時刻入力のための日付文字列
  $: inputDate = new Date().toLocaleDateString();
  $: inputTime = new Date().toLocaleTimeString();

  const dispatch = createEventDispatcher();

  const toggleActive = () => {
    active = !active;
    dispatch("toggle-active");
  };

  $: {
    inputDate;
    inputTime;
    // console.log(getArbitTimeAsDate());
    dispatch("input-time-changed", { datetime: getArbitTimeAsDate() });
  }

  const getArbitTimeAsDate = () => {
    // 外部パッケージを用いて取得した日時を一つのDateオブジェクトにして返す.
    const datetimeStr = `${inputDate} ${inputTime}`;
    return new Date(datetimeStr);
  };
</script>

<!-- 任意時刻を指定できるボックス. 反映されるか否かはボックスを開いているか否かのみに依存する. -->
<div class="arbitrary-time-input">
  <ToggleButton {active} on:click={toggleActive} />
  {#if !active}
    <span>任意の時刻を入力</span>
  {:else}
    <label for="date-picker">日付</label>
    <input id="date-picker" type="date" bind:value={inputDate} />
    <label for="time-picker">時刻</label>
    <input id="time-picker" type="time" bind:value={inputTime} />
  {/if}
</div>

<style>
  .arbitrary-time-input {
    border: 1px solid #777;
    margin: 0.6rem auto;
    padding: 1rem 0.6rem;
  }
  span {
    margin: 0 0.5rem;
  }
</style>
