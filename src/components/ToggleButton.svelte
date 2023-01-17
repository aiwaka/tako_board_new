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
    width: 1.2rem;
    height: 1.2rem;
    background: transparent;
    line-height: 1rem;
    border: 1px solid var(--main-font-color);
    cursor: pointer;
  }
</style>
