<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { signInWithEmailAndPassword, signOut } from "firebase/auth";
  import { auth } from "@/settings/firebase";
  import { getUserName } from "$lib/utils/get-username";

  import ButtonUi from "@/components/ButtonUi.svelte";

  $: errorMessage = "";
  $: loggedIn = false;
  let loginUserName: null | string = null;
  $: loginUserName = loginUserName;
  $: passwordInput = "";
  $: emailInput = "";

  onMount(async () => {
    const userName = await getUserName();
    loggedIn = !!userName;
    if (userName !== null) {
      loginUserName = userName;
    }
  });

  const login = () => {
    signInWithEmailAndPassword(auth, emailInput, passwordInput)
      .then(() => {
        if ($page.url.searchParams.get("redirect")) {
          const redirect = $page.url.searchParams.get("redirect");
          if (typeof redirect === "string") {
            goto(`/${redirect}`, { replaceState: true });
          } else {
            goto("/");
          }
        } else {
          goto("/");
        }
      })
      .catch((error) => {
        const code = error.code;
        const message = error.message;
        errorMessage = `${code}:${message}`;
      });
  };
  const logout = () => {
    if (confirm("ログアウトしますか？")) {
      signOut(auth)
        .then(() => {
          goto("/");
        })
        .catch((error) => {
          errorMessage = error.message;
        });
    }
  };
</script>

<div class="login-page">
  {#if !loggedIn}
    <div class="login-form">
      <label for="login-email-input">e-mail</label>
      <input id="login-email-input" placeholder="name" bind:value={emailInput} />
      <label for="login-password-input">password</label>
      <input
        id="login-password-input"
        placeholder="password"
        type="password"
        bind:value={passwordInput}
      />
      <div class="login-button-container">
        <ButtonUi on:click={login}>ログイン</ButtonUi>
      </div>
    </div>
  {:else}
    <div class="login-name-display">
      {loginUserName}としてログインしています。
      <ButtonUi on:click={logout}>ログアウト</ButtonUi>
    </div>
  {/if}

  {#if errorMessage}
    <div class="error-msg">
      {errorMessage}
    </div>
  {/if}
</div>

<style>
  .login-form {
    margin: 1rem auto;
    width: 70%;
    display: grid;
    grid-template-columns: 6rem 6rem 3rem;
    row-gap: 1rem;
  }
  @media (max-width: 1024px) {
    .login-form {
      width: 80%;
    }
  }
  .login-form > input {
    grid-column: 2 / -1;
  }
  .login-button-container {
    grid-column: 2 / -1;
    text-align: right;
  }
</style>
