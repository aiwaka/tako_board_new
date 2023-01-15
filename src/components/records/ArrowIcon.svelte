<script lang="ts">
  export let active: boolean;
</script>

<!-- 矢印形のコンポーネント. アクティブならば色が変化する -->
<div class="arrow-icon" class:active-arrow={active} />

<style>
  .arrow-icon {
    margin: 0.2rem;
    position: relative;
    padding-top: 32px;
    width: 32px;
  }
  .arrow-icon::before {
    box-sizing: border-box;
    content: "";
    position: absolute;
    margin: auto;
    top: 16px;
    left: 0px;
    width: 16px;
    height: 16px;
    border-top: 16px solid var(--inactive-arrow-color);
    border-bottom: 0px;
    border-left: 16px solid transparent;
    border-right: 16px solid transparent;
  }

  .arrow-icon.active-arrow::before {
    border-top: 16px solid var(--active-arrow-color);
  }
  .arrow-icon::after {
    content: "";
    position: absolute;
    margin: auto;
    top: 3px;
    /* left: 16px - (14/2)px */
    left: 9px;
    width: 14px;
    height: 13px;
    background-color: var(--inactive-arrow-color);
  }
  .arrow-icon.active-arrow::after {
    background-color: var(--active-arrow-color);
  }
</style>
