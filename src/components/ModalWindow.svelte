<script lang="ts">
  import { getImageURL } from "$lib/records/image";
  // import { createEventDispatcher } from "svelte";

  $: imageURL = "";
  $: showContents = false;
  export let imageName: string;

  // const dispatch = createEventDispatcher();

  // emits: ["close-window"],
  const closeModal = () => {
    showContents = false;
  };

  const openModal = async () => {
    if (imageURL === "") {
      imageURL = await getImageURL(imageName);
    }
    showContents = true;
  };
</script>

<div class="modal-window">
  <button on:click|preventDefault={openModal}>
    <slot />
  </button>
  {#if showContents}
    <!--
      svelte-ignore a11y-click-events-have-key-events
      アクセシビリティを考慮しなくてよい機能のため警告を無視する.
    -->
    <div class="close-modal" role="none" on:click={closeModal}>
      <div class="contents">
        <button class="close-button" on:click={closeModal}> x </button>
        <img class="image" src={imageURL} alt="modal" />
      </div>
    </div>
  {/if}
</div>

<style>
  .close-modal {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  button {
    border: none;
  }

  .contents {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 11;
    max-width: 90%;
    max-height: 80%;
    width: fit-content;
    height: fit-content;
    padding: 0;
  }
  .contents .close-button {
    line-height: 1.4rem;
    width: 1.6rem;
    height: 1.6rem;
    background-color: #bbb;
    cursor: pointer;
  }
  .contents .image {
    border: 4px double #ccc;
    max-height: 70vh;
    max-width: 80vw;
    aspect-ratio: auto;
  }
</style>
