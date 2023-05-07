<script lang="ts">
  export let disabled = false;
</script>

<button class="button-ui" type="button" {disabled} on:click>
  <slot />
</button>

<style>
  .button-ui {
    padding: 0.1rem 0.1rem;
    border: 2px solid #777;
    border-radius: 4px;
    transition: 0.25s ease-out;
    height: 100%;
  }
  .button-ui[disabled] {
    color: #999999;
  }
  .button-ui:not([disabled]):hover {
    border-radius: 8px;
  }
</style>
