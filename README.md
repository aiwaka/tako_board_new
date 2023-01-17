# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## 注意

- 旧Tako Boardのリポジトリは[ここ](https://github.com/littleIkawa/tako_board_easy_app).
Firebaseの設定は完全に同一.
- `yarn create svelte`はNodeのバージョンが17.xでないと動かない.
しかし, SveltekitはNodeバージョンが19.xでないと`yarn install`で弾かれる.
そのため`nodenv`で上のディレクトリは`17.0.1`にし, このリポジトリのルートで`19.3.0`にしている.
- `yarn install`で作られるデフォルト状態の`.prettierrc`で指定されたルールでは, スペースではなくタブを使うなど好きじゃないルールが多かった.
そのため最初のコミットよりも前に, それらのルールを消去し, 全ファイルのタブ文字をスペース2個に置き換える作業をしている.
- `vite.config.js`と`tsconfig.json`におけるエイリアス解決設定もデフォルトでは含まれていない.

