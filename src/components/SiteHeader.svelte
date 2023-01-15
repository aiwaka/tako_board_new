<script lang="ts">
  import PageLink from "@/components/PageLink.svelte";
  import { base } from "$app/paths";

  interface NavLink {
    name: string;
    href: string;
  }

  // 表示名とリンクを並べる
  export let navLinkList: NavLink[];
</script>

<div id="website-header">
  <div class="title-block">
    <a href={base + "/"}>
      <span class="site-icon">
        <img src={`${base}/img/logo.png`} alt="site-icon" />
      </span>
      <h1 class="title">Tako Board</h1>
    </a>
  </div>
  <nav>
    <div class="nav-link-wrapper">
      {#each navLinkList as navLink}
        <PageLink href={base + navLink.href}>{navLink.name}</PageLink>
      {/each}
    </div>
  </nav>
</div>

<style>
  #website-header {
    z-index: 9950;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    width: 100%;
    height: 8rem;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    background-color: var(--main-bg-color);
    backdrop-filter: blur(1rem);
    border-bottom: 2px solid var(--main-bg-color);
  }
  @media (max-width: 1024px) {
    #website-header {
      flex-direction: column;
      height: calc(8rem + 3rem);
    }
  }

  .title-block {
    margin: 0.2rem 2rem;
    font-family: "Noto Serif JP", serif;
  }
  .title-block > a {
    display: flex;
  }
  @media (max-width: 1024px) {
    .title-block {
      margin: 0 2rem;
    }
  }
  .site-icon {
    height: 6rem;
    width: 6rem;
    display: block;
    margin: auto 1.1rem;
    border-radius: 100%;
    border: 3px solid var(--sub-font-color);
    overflow: hidden;
  }
  .site-icon > img {
    height: 100%;
    width: 100%;
  }
  .title {
    display: block;
    color: var(--main-font-color);
    font-size: 3.6rem;
    line-height: 8rem;
    font-weight: bold;
  }
  @media (max-width: 1024px) {
    #website-header .title {
      font-size: 2.2rem;
    }
  }

  nav .nav-link-wrapper {
    display: flex;
    justify-content: space-between;
    margin: 0 1.4rem;
    margin-right: 3.4rem;
    width: fit-content;
  }
  @media (max-width: 1024px) {
    nav .nav-link-wrapper {
      position: relative;
      bottom: 0;
      height: 3rem;
    }
  }
</style>
