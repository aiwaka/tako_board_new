<script>
  import { base } from "$app/paths";
</script>

<div class="home">
  <h1>Tako Board</h1>
  <div class="version">Ver 0.8.0</div>
  <p>ちゃこちゃんのお世話管理アプリ</p>
  <img alt="tako" src={`${base}/img/tako.png`} />
</div>

<style>
  .home .version {
    color: #999999;
    font-size: 0.9rem;
  }
  .home > img {
    margin: 15px auto;
    width: 50%;
  }
</style>
