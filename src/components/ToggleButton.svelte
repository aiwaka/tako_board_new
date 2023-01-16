<script lang="ts">
  export let active: boolean;
</script>

<button class="toggle-button" on:click>
  {#if active}
    -
  {:else}
    +
  {/if}
</button>

<style>
  .toggle-button {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    background: transparent;
    line-height: 1.8rem;
    border: 1px solid #000;
    cursor: pointer;
  }
</style>
