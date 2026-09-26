# CSSコーディングガイドライン

CSS の記法と知識をまとめた日本語の技術書を、Astro Starlight で作っている。著者は TAK。本書は AI に参照させるドキュメントも兼ねる。方針の詳細と経緯は `DECISIONS.md` にある。方針を変えるときは、先に著者に確認する。

## コマンド

- `pnpm dev`: 開発サーバー。下書き（`draft: true`）のページも表示される。
- `pnpm build`: 本番ビルド。下書きは除かれ、内部リンクが検証される。
- `pnpm lint:css`: サイトの CSS とデモの CSS を Stylelint で検証する。
- `pnpm lint:examples`: 原稿の 🙆‍♂ Recommended の CSS コード例を Stylelint で検証する。
- `pnpm lint:text`: 原稿を textlint で検証する。
- `pnpm gen:ai`: ルールから AI 向けのルール集とスキル（`skills/css-coding-guideline/`）を生成する。ルールを変えたら必ず実行する。

## ファイルの配置

- `src/content/docs/<章のディレクトリ>/`: 原稿。章のディレクトリと節のファイル名は URL になるので、変えない。
  - `index.mdx` は章の概要ページ（`sidebar.order: 0`）。
  - 節は `sidebar.order` で並べる。
- `src/content/rules/*.yaml`: ルールの定義。書式は同じディレクトリの `README.md` を見る。
- `src/demos/<章のディレクトリ>/<デモ名>/`: デモの `index.html` と `style.css`。
  - 🙅‍♂ Not Recommended のデモは `style.bad.css` という名前にする（Stylelint の対象外になる）。
- `src/components/`
  - `Demo`：ライブデモ
  - `Guideline`：そのページのルール
  - `Baseline`：ブラウザの対応状況
  - `RuleList`：付録A
  - `ImagePlaceholder`：用意できていない画像
- `src/lib/book.mjs`: 部と章の構成。サイドバーと生成スクリプトが使う。
- `astro.config.mjs`: ルールへのリンク（`/<page>/#rule-<id>`）は、ルールの定義と照らして正しいものだけをリンク検証から外している。
- `stylelint.config.mjs`、`stylelint/`: 本書の Stylelint 設定。本文で説明するルールと一致させる。

## 原稿の書き方（要点）

- 著者の執筆スタイルに従う。
  - です・ます調で書き、結論から話す。
  - 1段落は2〜4文。
  - 箇条書きは最小限にし、文章で説明する。
  - 感嘆符は使わない。
  - 冗長な表現を避ける。
- 一人称は「私」で、使うのは控えめにする。見解は根拠とともに述べる。
- 節のページの流れは次のとおり。
  1. 冒頭で結論
  2. 問題提起
  3. 解決策
  4. コード例とデモ
  5. 補足と注意点
  6. `## ガイドライン`（直後に `<Guideline />`）
  7. `## 参考リンク`
- 1ページは4,000〜6,000字で、各見出しに3〜5段落を書く。
- 各ページが単体で意味が通るように書く。ほかのページに触れるときは、リンクと一言の要約を添える。
- コード例のラベル
  - コードブロックのタイトルに `🙆‍♂ Recommended: …` と `🙅‍♂ Not Recommended: …` を付ける。
  - Not Recommended の例は、先頭行にも `/* 🙅‍♂ Not Recommended */` と書く。
  - Recommended の CSS は、完全なルールとして書く（Stylelint で検証するため）。
- 省略は `/* ... */` と書く。和文と英数字の間にスペースを入れない。
- 用語の表記は `prh.yml` に合わせる。
  - セレクタ、ブレイクポイント、コンテナクエリ、プロパティ、ブラウザ、ユーザー、レイヤー、デフォルト
- 時間で変わる記述（対応ブラウザなど）には、確認した年月を書く。機能の対応状況は `<Baseline id="…" />` で示す。
- 著者の資料に出典のない内容には、`{/* 要確認: 出典なし */}` を付ける。
- MDX の地の文では `<` と `{` がコードとして解釈される。HTML タグや CSS は必ずバッククォートで囲む。

## CSS の書き方（本書のルールの要点）

本書のサンプルとサイトの CSS は、本書のルールに従う。詳しいルールは `src/content/rules/*.yaml` と各章にある。

- 論理プロパティ、`display` の2値構文（`block flex`）、変形の個別プロパティ（`translate` など）を使う。
- クエリは範囲構文で書き、閾値は `calc(640 / 16 * 1rem)` の形にする。`vw` と `vh` は使わない。
- ネストは1段で、先頭に `&` を書く。`@media` と `@container` は各セレクタの中に書く。
- 命名
  - ルートは `scoped <名前>`、子要素は `._kebab`、ユーティリティは `.-kebab`。
  - カスタムプロパティは、公開用が `--<コンポーネント>--<プロパティ>`、内部用が `--_<プロパティ>`。
- スコープは `@scope (.scoped.<名前>) to (.scoped)`。

## 章を書く手順

見本の章は第8章（`src/content/docs/responsive/`）。文体、節の構成、コード例とデモの見せ方、ルールの粒度は、これに合わせる。

1. 骨組みのページ（`draft: true` と「執筆予定」のメモ）を本文で置き換える。frontmatter の `title` と `sidebar.order` は変えず、`draft: true` を消して `description` を書き直す。
2. ルールを `src/content/rules/<章番号2桁>-<章のディレクトリ>.yaml` に書く（例：`05-notation.yaml`）。ID はほかの章と重複させない（`grep -rn "id: <ID>" src/content/rules` で確認する）。
3. デモは `src/demos/<章のディレクトリ>/<デモ名>/` に `index.html` と `style.css` で置く。
   - デモの CSS も本書の規約で書く。`@layer` と `@scope (.scoped.<名前>) to (.scoped)` は省略しない。
4. 対応状況は `<Baseline id="…" />` で示す。ID が web-features にあるかは、次のコマンドで確認する。

   ```
   node --input-type=module -e "import { features } from './node_modules/web-features/index.js'; console.log(features['<ID>']?.status)"
   ```

5. まだ書かれていない章へのリンクは張らない。章名だけを書き、直後に `{/* 第N章の執筆後にリンクする: /dir/slug/ */}` を残す。
6. 自分が書いたファイルを検証する。複数の作業が同時に走るので、`pnpm build` と `pnpm dev` は実行しない。
   - `node scripts/check-mdx.mjs <MDX ファイル>`：MDX の構文
   - `node scripts/lint-examples.mjs <MDX ファイル>`：Recommended のコード例
   - `node node_modules/stylelint/bin/stylelint.mjs "src/demos/<章>/**/*.css"`：デモの CSS（`pnpm exec` は権限で拒否される）
   - `node node_modules/textlint/bin/textlint.js <MDX ファイル>`：原稿
   - YAML の構文：`node -e "require('yaml').parse(require('fs').readFileSync('<ファイル>','utf8'))"`
7. 共有のファイル（コンポーネント、設定、ほかの章、`CLAUDE.md`、`DECISIONS.md`）は変えない。変える必要があれば報告する。

## 情報源

- 著者の資料：gist、astro-template、tak-dcxi.com、Zenn、CodePen、案件リポジトリのうち著者本人が書いた CSS。
- 調査メモは `.notes/` にある（git の管理外）。案件名を含むのでコミットしない。原稿に案件名を書かない。
  - `.notes/gists/`：著者の gist の原文（執筆スタイル、タイポグラフィ、レスポンシブ、keyframes、animations スキル、レビューのチェックリスト）
  - `.notes/local/`：astro-template と案件リポジトリの調査（著者本人が書いた CSS だけ）
  - `.notes/blog/`、`.notes/zenn/`、`.notes/codepen/`：記事の一覧と実践のまとめ（`PRACTICES.md`）
  - `.notes/refs/`：参考サイトのトピック
  - `.notes/starlight.md`：Starlight の調査
  - `.notes/talk-2025.md`：登壇の要旨
- 他人が書いた CSS は参考にしない。
