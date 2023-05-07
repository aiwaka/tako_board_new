<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import CrossIcon from "../svg/CrossIcon.svelte";

  export let name: string;
  const dispatch = createEventDispatcher<{ "delete-tag": { tagName: string } }>();
</script>

<div class="type-tag">
  <span class="text">
    {name}
  </span>
  <button
    type="button"
    on:click={() => {
      dispatch("delete-tag", { tagName: name });
    }}
  >
    <CrossIcon disabled={false} />
  </button>
</div>

<style>
  .type-tag {
    display: flex;
    column-gap: 0.5rem;
    border-radius: 12px;
    border: 1px solid #777;
    padding: 0.1rem 0.4rem;
    margin: 0.2rem 0.2rem;
  }
  button {
    border: 0;
  }
  button:hover {
    cursor: pointer;
  }
</style>
