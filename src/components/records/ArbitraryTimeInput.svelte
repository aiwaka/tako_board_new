<script lang="ts">
  // NOTE: 2023/1/16 SveltyPickerはいい感じだったがバインドにバグがありそう（REPLも動いていなかった）
  import { createEventDispatcher } from "svelte";
  import { toTimeString, toDateString } from "$lib/utils";
  import ToggleButton from "../ToggleButton.svelte";

  $: active = false;
  // 任意時刻入力のための日付文字列
  const currentDatetime = new Date();
  $: inputDate = toDateString(currentDatetime);
  $: inputTime = toTimeString(currentDatetime);

  const dispatch = createEventDispatcher();

  const toggleActive = () => {
    active = !active;
    dispatch("toggle-active", { active });
  };

  $: {
    inputDate;
    inputTime;
    dispatch("input-time-changed", { datetime: getArbitTimeAsDate() });
  }

  const getArbitTimeAsDate = () => {
    // 指定された日時を一つのDateオブジェクトにして返す.
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
    <fieldset class="input-form">
      <label for="date-picker">日付</label>
      <input id="date-picker" type="date" bind:value={inputDate} />
      <label for="time-picker">時刻</label>
      <input id="time-picker" type="time" bind:value={inputTime} />
    </fieldset>
  {/if}
</div>

<style>
  .arbitrary-time-input {
    border: 1px solid var(--main-font-color);
    margin: 0.6rem auto;
    padding: 0.8rem 0.7rem;
  }
  .input-form {
    border: none;
    display: grid;
    grid-template-columns: auto auto;
    row-gap: 1rem;
    column-gap: 0.8rem;
  }
</style>
