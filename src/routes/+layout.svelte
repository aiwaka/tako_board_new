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

<!-- <Analytics /> -->

<svelte:head>
  <link rel="stylesheet" href={`${base}/style/main.css`} />
  <!-- ブログの個別ページでは別の画像や説明を設定するため除外する -->
  {#if $page.route.id !== `/blog/[slug]`}
    <meta property="og:url" content={ogp.url} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="" />
    <meta property="og:description" content="" />
    <meta property="og:site_name" content="KULMC Website" />
    <meta property="og:image" content="TODO:" />
    <meta name="twitter:card" content="summary" />
  {/if}
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
    height: 13rem;
  }
  .body-container {
    margin: 1rem 10%;
  }

  @media (max-width: 1024px) {
    .body-container {
      margin: 1rem 4%;
    }
  }
</style>
