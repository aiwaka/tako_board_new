<script lang="ts">
  import { toDateString, toTimeString } from "$lib/utils";
  import { DateInput } from "date-picker-svelte";
  import { createEventDispatcher } from "svelte";

  $: active = false;
  // 任意時刻入力のための日付文字列
  $: inputDate = toDateString(new Date());
  // $: inputTime = toTimeString(new Date());
  $: pickedDate = new Date();
  // $: pickedTime = new Date();

  const dispatch = createEventDispatcher();

  // emits: ["input-time-changed", "toggle-active"],
  const toggleActive = () => {
    active = !active;
    dispatch("toggle-active");
  };

  // watch([pickedDate, pickedTime], () => {
  //   context.emit("input-time-changed", getArbitTimeAsDate());
  // });

  $: {
    pickedDate;
    dispatch("input-time-changed", getArbitTimeAsDate());
  }

  const getArbitTimeAsDate = () => {
    // 外部パッケージを用いて取得した日時を一つのDateオブジェクトにして返す.
    const date = pickedDate;
    // const time = pickedTime;
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
      // time.getHours(),
      // time.getMinutes()
    );
  };
</script>

<!-- 任意時刻を指定できるボックス. 反映されるか否かはボックスを開いているか否かのみに依存する. -->
<div class="arbitrary-time-input">
  {#if !active}
    <button class="toggle-button" on:click={toggleActive}>+</button>
    <span>任意の時刻を入力</span>
  {:else}
    <button class="toggle-button" on:click={toggleActive}>-</button>
    <label for="date-picker">日付</label>
    <div id="date-picker">
      <DateInput bind:value={pickedDate} format="yyyy-MM-dd HH:mm" />
    </div>
    <!-- <datepicker
      class="date-picker"
      startingView="day"
      minimumView="day"
      inputFormat="yyyy-MM-dd"
      v-model="pickedDate"
    /> -->
    <!-- <label>時刻</label> -->
    <!-- <datepicker
      class="date-picker"
      startingView="time"
      minimumView="time"
      inputFormat="HH:mm"
      v-model="pickedTime"
    /> -->
  {/if}
</div>

<style>
  .arbitrary-time-input {
    border: 1px solid #777;
    margin: 0.6rem auto;
    padding: 1rem 0.6rem;
  }
  .toggle-button {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    line-height: 1rem;
    border: 1px solid #000;
    cursor: pointer;
  }
  span {
    margin: 0 0.5rem;
  }
</style>
