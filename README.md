# Tako Board (New)

バージョン0.7.0

## 概要

うちのうさぎのお世話記録をつける掲示板.

## 仕様

- メールアドレスを利用したログイン認証機能（Firebase Authentication）.
- リモートデータベースを用いた記録（Firestore）.
- レスポンシブデザインで携帯端末でも見やすい.
- 日付区間とレコードタイプを指定して過去の記録を読み込める（デフォルトは当日から一週間前まですべてのタイプを読み込む）.
- レコード追加・削除時には全体の再読み込みがなされずに反映されるため処理が軽量.
- レコードの削除は投稿した本人のみが可能.
- 記録を付けるのを忘れても任意の時刻を簡単に入力可能.
- 長いコメントは自動で折りたたまれ, クリックすると全文を見られる.
- 画像投稿機能を追加. Firebase Storage に保存され各レコードと紐付けられる.
- Firebase の API の FirestoreDataConverter を使用することでデータの型付けを得, 可読性・保守性を向上.
- 入力からFirestoreの検索クエリを作成しリストを取得する形式に変更（v0.3.3）.
- UIを刷新. 使用フレームワークをVue.jsからSvelteに変更（v0.7.0）.

## 画像（旧バージョン）

<p>
<img alt="トップ画面" src="https://user-images.githubusercontent.com/38373453/172039350-6e398f0c-c1f2-4e0c-ad02-fa18ffcf6862.jpg" width="45%">
<img alt="ログイン画面" src="https://user-images.githubusercontent.com/38373453/172039382-ece9ce18-8dbc-4311-806a-63aeceb807a6.jpg" width="45%">
<img alt="入力" src="https://user-images.githubusercontent.com/38373453/172039496-e5a79720-543e-4283-8a9f-8bbe4af1aae4.jpg" width="45%">
<img alt="レコードリスト" src="https://user-images.githubusercontent.com/38373453/172039458-2f4b2fbd-e42c-4717-936e-9b453fa8c0f9.jpg" width="45%">
</p>

## 画像（新バージョン）

<p>
<img alt="トップ画面" src="https://user-images.githubusercontent.com/38373453/215893175-af18d8cd-bc93-4445-b1ef-553688af9e3f.PNG" width="45%">
<img alt="ログイン画面" src="https://user-images.githubusercontent.com/38373453/215893172-bbc2556d-c915-4fe5-9d14-9c93a8400737.jpg" width="45%">
<img alt="入力" src="https://user-images.githubusercontent.com/38373453/215893168-166e62e4-692b-4284-932c-75308566b479.PNG" width="45%">
<img alt="レコードリスト" src="https://user-images.githubusercontent.com/38373453/215893163-5ac237cc-5497-462a-be8a-708d92edae8c.jpg" width="45%">
</p>

## 使用技術

v0.5.0まで：

- Firebase（Firestore, Authentication, Storage）
- Vue.js 3（Composition API）
- Typescript
- SCSS

v0.7.0以降：

- Firebase（Firestore, Authentication, Storage）
- SvelteKit
- Typescript

## 注意

- 家族専用なので現在新規登録等は不可能.
- 旧Tako Boardのリポジトリは[ここ](https://github.com/littleIkawa/tako_board_easy_app).
Firebaseの設定は完全に同一.
- `yarn create svelte`はNodeのバージョンが17.xでないと動かない.
しかし, SveltekitはNodeバージョンが19.xでないと`yarn install`で弾かれる.
そのため`nodenv`で上のディレクトリは`17.0.1`にし, このリポジトリのルートで`19.3.0`にしている.
- `yarn install`で作られるデフォルト状態の`.prettierrc`で指定されたルールでは, スペースではなくタブを使うなど好きじゃないルールが多かった.
そのため最初のコミットよりも前に, それらのルールを消去し, 全ファイルのタブ文字をスペース2個に置き換える作業をしている.
- `vite.config.js`と`tsconfig.json`におけるエイリアス解決設定もデフォルトでは含まれていない.

## 更新履歴

- 2021/11/03：開発開始（[旧リポジトリ](https://github.com/littleIkawa/tako_board_easy_app)）。
- 2021/11/09：初版v0.1.0公開。
- 2022/02/20：任意時刻入力機能やコメントの折りたたみ機能を追加してv0.2.0を公開。
- 2022/06/08：写真アップロード機能等を追加しv0.3.0を公開。
- 2022/06/09：コードのリファクタリングと最適化を行ったv0.3.1を公開。
- 2022/06/21：年表記を削除（v0.3.2）。
- 2022/07/30：レコード検索機能を追加（v0.3.3）。
- 2022/08/08：デザインを大幅に変更し、v0.4.0を公開。
- 2023/01/18：UIを刷新。機能は変わっていないが、開発に用いたフレームワークも変更した（Vue.jsからSvelte）。シングルページアプリケーションではなくなり、CSSフレームワークの使用をやめた（v0.7.0とする）。
- 2023/01/19：ファイルアップローダーの不具合を修正（v0.7.1）。
