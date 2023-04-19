<script lang="ts">
  import { blur } from "svelte/transition";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import type { LayoutData } from "./$types";
  import SiteFooter from "@/components/SiteFooter.svelte";
  import SiteHeader from "@/components/SiteHeader.svelte";

  $: ogp = {
    url: $page.url.toString(),
  };

  /**
   * ヘッダのナビゲーションリストに渡すためのデータ.
   * nameとhrefを持つオブジェクトのリストを渡す.
   */
  const pageList = [
    { name: "TOP", href: "/" },
    { name: "ABOUT", href: "/about" },
    { name: "LOGIN", href: "/login" },
    { name: "RECORD", href: "/record" },
  ];

  export let data: LayoutData;
</script>

<svelte:head>
  <link rel="stylesheet" href={`${base}/style/main.css`} />
  <title>Tako Board</title>
  <meta property="og:url" content={ogp.url} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Tako Board" />
  <meta property="og:description" content="うさぎのお世話掲示板" />
  <meta property="og:site_name" content="Tako Board" />
  <meta property="og:image" content="https://tako-board-1.web.app/img/logo.png" />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<SiteHeader navLinkList={pageList} />
<div class="header-margin" />
<div class="body-container">
  {#key data.currentRoute}
    <main
      class="main-container"
      in:blur={{ duration: 250, delay: 50 }}
      out:blur={{ duration: 250 }}
    >
      <slot />
    </main>
  {/key}
</div>
<SiteFooter />

<style>
  .header-margin {
    height: 6rem;
  }
  .body-container {
    margin: 1rem 10%;
  }

  @media (max-width: 1024px) {
    .header-margin {
      height: 8rem;
    }
    .body-container {
      margin: 1rem 4%;
    }
  }
</style>
