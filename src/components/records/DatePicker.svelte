<script lang="ts">
  import { toDateString } from "$lib/utils";
  import { createEventDispatcher } from "svelte";

  const today = new Date();
  const tempToday = new Date();
  const prevWeekDay = new Date(tempToday.setDate(tempToday.getDate() - 7));

  $: endDate = toDateString(today);
  $: startDate = toDateString(prevWeekDay);

  const dispatch = createEventDispatcher();

  const endDateChanged = () => {
    dispatch("end-date-changed", endDate);
    // context.emit("end-date-changed", endDate.value);
  };
  const startDateChanged = () => {
    dispatch("start-date-changed", startDate);
    // context.emit("start-date-changed", startDate.value);
  };
</script>

<div class="date-selector">
  <input type="date" bind:value={startDate} on:change={startDateChanged} />
  から
  <input type="date" bind:value={endDate} on:change={endDateChanged} />
</div>

<style>
  .date-selector {
    display: flex;
    justify-content: center;
  }
  .date-selector > input {
    margin: auto 15px;
  }
</style>
