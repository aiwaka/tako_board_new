<script lang="ts">
  import type { recordTypeStrList } from "$lib/records";
  import CrossIcon from "../svg/CrossIcon.svelte";

  export let name: (typeof recordTypeStrList)[number];
</script>

<div class="type-tag">
  {name}
  <CrossIcon disabled={true} />
</div>
