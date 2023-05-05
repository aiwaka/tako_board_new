<script lang="ts">
  import type { recordTypeStrList } from "$lib/records";
  import CrossIcon from "../svg/CrossIcon.svelte";

  export let name: (typeof recordTypeStrList)[number];
</script>

<div class="type-tag">
  <span>
    {name}
  </span>
  <CrossIcon disabled={true} />
</div>

<style>
  .type-tag {
    display: flex;
  }
</style>
