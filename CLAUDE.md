# CSSコーディングガイドライン

CSS の記法と知識をまとめた日本語の技術書を、Astro Starlight で作っている。著者は TAK。本書は AI に参照させるドキュメントも兼ねる。方針の詳細と経緯は `DECISIONS.md` にある（git の管理外なので、著者の手元のチェックアウトにだけある。新しいクローンやワークツリーにはない）。方針を変えるときは、先に著者に確認する。

## コマンド

- `pnpm dev`: 開発サーバー。下書き（`draft: true`）のページも表示される。
- `pnpm build`: 本番ビルド。下書きは除かれ、内部リンクが検証される。
- `pnpm lint:css`: サイトの CSS とデモの CSS を Stylelint で検証する。
- `pnpm lint:examples`: 原稿の 🙆‍♂ Recommended の CSS コード例を Stylelint で検証する。
- `pnpm lint:text`: 原稿を textlint で検証する。
- `pnpm list:markers`: 刊行前に解消する印（`要確認`、`要検証`）を種類ごとに一覧にする。`--summary` で件数だけを出す。
- `pnpm gen:exercise`: 第20章のデモから、演習を手元で進めるためのファイル（`public/exercise-files/`）を生成する。
- `pnpm gen:ai`: ルールと原稿から、AI 向けの配布物を生成する。ルールか原稿を変えたら必ず実行する。
  - コミットするもの：スキルとプラグイン（`plugin/`）、マーケットプレイス（`.claude-plugin/marketplace.json`）、MCP サーバーの `package.json` と README の版
  - コミットしないもの：MCP サーバーが同梱するデータ（`packages/mcp/data/`）
- `pnpm test:mcp`: MCP サーバーを stdio で起動し、すべてのツールを1回ずつ呼んで確かめる（先に `pnpm gen:ai` を実行する）。

## ファイルの配置

- `src/content/docs/<章のディレクトリ>/`: 原稿。章のディレクトリと節のファイル名は URL になるので、構成を見直すとき以外は変えない。変えるときは、本文、ルールの `page`、更新履歴のリンクをすべて新しい URL に直す（公開前なので転送は置かない）。
  - 章の中にサブディレクトリを作らない。まとまりが大きくなったら、章を分ける。
  - `index.mdx` は章の概要ページ（`sidebar.order: 0`）。
  - 節は `sidebar.order` で並べる。
- `src/content/rules/*.yaml`: ルールの定義。書式は同じディレクトリの `README.md` を見る。各ルールに性質の `kind`（`spec`／`judgment`／`convention`）を付ける。
- `src/demos/<章のディレクトリ>/<デモ名>/`: デモの `index.html` と `style.css`。
  - 🙅‍♂ Not Recommended のデモは `style.bad.css` という名前にする（Stylelint の対象外になる）。
  - 悪い例と良い例、値の違いなどを比べるデモは、1つのデモの中に並べる（`data-*` 属性で片方だけ指定を変える）。比べる2つを別々のデモに分けない。
  - 状態の切り替えに JavaScript が要るデモは、`script.js` を置いて `<Demo js={…}>` に渡す。JavaScript のタブは出さない。CSS と HTML だけで作れるデモには使わない。
- `src/demos/tokens/*.css`: すべてのデモに `@layer tokens` として読み込まれる共通トークン。デモの CSS では宣言し直さずに参照する。デモはサイトのテーマ（ライトとダーク）に追従するので、色はセマンティクスのトークンで書く。特定の色を見せるデモだけは `<Demo scheme="light">` で固定し、値を直接書いてよい。
- `src/components/`
  - `Demo`：ライブデモ
  - `Guideline`：そのページのルール
  - `Baseline`：ブラウザの対応状況
  - `RuleList`：付録A
  - `Figure`：図（SVG）をインラインで埋め込み、ライトとダークのテーマに色を追従させる。SVG は `src/assets/figures/<章>/<名前>.svg` に置き、`<Figure src="<章>/<名前>" alt="…" />` で読み込む。SVG の中では色を直接書かず、`Figure.astro` のクラス（`_box`、`_box -accent`、`_text`、`_text-muted`、`_text-accent`、`_arrow`、`_arrowhead`）を使う
  - `ImagePlaceholder`：用意できていない画像
- `src/lib/book.mjs`: 部と章の構成。サイドバーと生成スクリプトが使う。章の `review` は、AI がレビューで読む章を選ぶ条件（スキルと MCP に出る）。章で扱う話題を変えたら、これも直す。
- `src/lib/site.mjs`: 公開先の URL。公開先を変えたら、ここを直して `pnpm gen:ai` を実行する。
- `scripts/lib/guideline-data.mjs`: ルールと原稿を読み、AI 向けの形にする（MDX のコンポーネントを Markdown に置き換える）。新しいコンポーネントを原稿で使うときは、ここにも置き換え方を足す。
- `plugin/`、`.claude-plugin/marketplace.json`: Claude Code のプラグインとスキル。`pnpm gen:ai` が生成するので、直接編集しない。
- `packages/mcp/`: npm に公開する MCP サーバー（`css-coding-guideline-mcp`）。版は本のバージョンと同じで、`.github/workflows/publish-mcp.yml` が、npm にまだない版を公開する（リポジトリの変数 `PUBLISH_MCP` が `true` のときだけ動く）。
- `astro.config.mjs`: ルールへのリンク（`/<page>/#rule-<id>`）は、ルールの定義と照らして正しいものだけをリンク検証から外している。
- `stylelint.config.mjs`、`stylelint/`: 本書の Stylelint 設定。本文で説明するルールと一致させる。

## 原稿の書き方（要点）

- 文章の規範は、スキル `japanese-tech-writing`（gist fd287c3133457c4fd8f5601d34aa817d）に従う。次の執筆スタイルと衝突したら、スキルを優先する。体裁（節の流れ、コード例のラベル、字数）は、このファイルの定めのままにする。
- 著者の執筆スタイルに従う。
  - です・ます調で書き、結論から話す。
  - 1段落は2〜4文。
  - 箇条書きは最小限にし、文章で説明する。
  - 感嘆符は使わない。
  - 冗長な表現を避ける。
- 一人称は「私」で、使うのは控えめにする。見解は根拠とともに述べる。
- 本文に個人名を出さない。「〜氏は…と述べています」のように人の発言として紹介せず、本書の主張として書く。出典は参考リンクに挙げる。
- 節のページは、冒頭で結論を述べ、末尾に `## ガイドライン`（直後に `<Guideline />`）と `## 参考リンク` を置く。間の流れは、節の目的に合う型を選ぶ。説明のために問題を大きく見せない。
  - 仕組みを理解する節：現象 → 予測 → 仕組み → 確認
  - 手法を選ぶ節：要件 → 選択肢 → 比較 → 判断
  - 実装する節：完成形 → 手順 → 検証 → 注意点
  - 規約を導入する節：目的 → 約束 → 例外 → 運用。本書独自の規約を導入する節は、「補足と注意点」などで採用のコスト（増える概念、宣言と参照の追い方、使わない方がよい規模、チームへの導入の順序）を書く。
  - 従来の流れ（問題提起 → 解決策 → 補足と注意点）も使ってよい。既存の節は一斉に書き直さず、手を入れるときに合わせる。
- 「コード例とデモ」の見出しは置かない。コード例とデモは、説明する見出しの直下に置く（全章）。
- 第II部の基礎編（第4〜7章）の節は、各見出しの直下にサンプルを置く。
  - 仕組みや書き方を説明する見出しには、必ずコード例を置く。表示が変わる話（レイアウト、大きさ、Flexbox や Grid の振る舞いなど）には、その見出しの直下にデモも置く。
  - 「補足と注意点」と、判断や使い分けだけを述べる見出しには、サンプルを求めない。冒頭の問題提起は、問題がコードに関わるなら Not Recommended の例を置く。
  - コード例とデモは字数に数えない。
- 字数は、一度に理解してほしい判断のまとまりで決める。下限は置かず、8,000字を超えるときは分けるかを著者に確かめる。各見出しの段落数（3〜5段落）は目安とする。章の概要ページ、「はじめに」のページ（`introduction/` 以下）、ルールを置かない考え方の節（1-3〜1-7、2-1、2-2、3-1、3-2）は、字数の規定の対象外。考え方の節には `## ガイドライン` を置かない。
- 第20章（演習編、`exercise/`）の節は、新しいルールを置かない。`## ガイドライン` の代わりに `## この節で使ったルール` を置き、使ったルールのIDを掲載ページへのリンク付きで並べる（例：`` [`density-via-style-query`](/components/style-queries/#rule-density-via-style-query) ``）。2節目以降は冒頭で要件を1つ変え、本文には変更した箇所だけのコード例を置き、デモはその節を終えた時点の全体を1つ置く。末尾に判断を問う問題を答えと解説付きで置く。
  - 演習の節は、本編の結論先行の例外として、要件 → `## 予想する` → `## 合格条件`（その節を終えた時点のデモ）→ 解説 → `## 振り返り` → 判断の問いの順にする。冒頭と `description` で直す箇所を言わない。振り返りでは、直す場所の数だけでなく、変更を受け持つ場所が予測できるか、影響範囲を確かめられるか、条件分岐が複雑になっていないかを問う。
  - 各節の冒頭に、`public/exercise-files/` の開始版と完成版へのリンクを置く（ファイル名まで書く）。演習のデモを変えたら `pnpm gen:exercise` を実行する。
  - 配布版は、デモの `style.css` を `@scope` ごとのファイル（`article-card.css` など）と `compositions.css` に分けて生成する。20-4以降の各段階には、記事ページとトップページを置く。トップページのソースは、デモのディレクトリの `top.html`（配布専用。カードのマークアップはその段階の `index.html` とそろえる）。
  - 演習デモのリンクは `href="#"` にせず、記事は `#article-<スラッグ>`、タグは `#tag-<スラッグ>` にする。
  - 題材のカードは `article-card`、一覧は `article-list`。
- 各ページが単体で意味が通るように書く。ほかのページに触れるときは、リンクと一言の要約を添える。
- 通読の流れもつなぐ。章の概要ページの末尾に `## この章で判断できるようになること` と `## 次の章へ` を数文ずつ置く。複数の章に出てくる主張（内容は変わる、保守性を優先する、AI の出力を検証する、など）は、同じ説明を繰り返さず、その章が担う役割（なぜ／どこが受け持つか／どう耐えるか／どう確認するか）で書く。
- デモは操作しなくても結論が分かるように、直前か直後の本文に「何を変えると、どこがどう変わるか」を書く（AI は本文だけを読む）。
- コード例のラベル
  - コードブロックのタイトルに `🙆‍♂ Recommended: …` と `🙅‍♂ Not Recommended: …` を付ける。`…` には、何が問題か、何を解決したかが分かる日本語を書く（例：「同じ閾値を3か所で管理する」「閾値を1か所に集める」）。
  - Not Recommended の例は、先頭行にも `/* 🙅‍♂ Not Recommended */` と書く。
  - Recommended の CSS は、完全なルールとして書く（Stylelint で検証するため）。
- 省略は `/* ... */` と書く。和文と英数字の間にスペースを入れない。
- 用語の表記は `prh.yml` に合わせる。
  - セレクタ、ブレイクポイント、コンテナクエリ、プロパティ、ブラウザ、ユーザー、レイヤー、デフォルト
  - サイズを問い合わせる `@container` は「コンテナサイズクエリ」と書く。「コンテナクエリ」は、サイズ・スタイル・スクロール状態の問い合わせの総称にだけ使う。
- 時間で変わる記述（対応ブラウザなど）には、確認した年月を書く。機能の対応状況は `<Baseline id="…" />` で示す。
- 刊行前に解消する点には、種類ごとの印を付ける。詳細は種類の後ろに「。」で続ける（例：`{/* 要検証: ブラウザ。強制カラーモードでの表示 */}`）。
  - `{/* 要確認: 出典なし */}`：著者の資料に出典のない内容
  - `{/* 要確認: 著者の判断 */}`：著者に選んでもらう点
  - `{/* 要検証: ブラウザ */}`：ブラウザで確かめていない挙動
- MDX の地の文では `<` と `{` がコードとして解釈される。HTML タグや CSS は必ずバッククォートで囲む。

## CSS の書き方（本書のルールの要点）

本書のサンプルとサイトの CSS は、本書のルールに従う。詳しいルールは `src/content/rules/*.yaml` と各章にある。

- 論理プロパティ、`display` の2値構文（`block flex`）、変形の個別プロパティ（`translate` など）を使う。
- クエリは範囲構文で書き、閾値は `calc(640 / 16 * 1rem)` の形にする。幅を足し合わせる式では、各項をその値を宣言した単位で書く（rem の幅は `… / 16 * 1rem`、px の `gap` や `padding` は px のまま。例：`calc(560 / 16 * 1rem + 240 / 16 * 1rem + 32px)`）。`vw` と `vh` は使わない。
- ネストは1段で、先頭に `&` を書く。`@media` と `@container` は各セレクタの中に書く。
- 命名
  - ルートは `scoped <名前>`、子要素は `._kebab`、ユーティリティは `.-kebab`。
  - カスタムプロパティは、公開用が `--<コンポーネント>--<プロパティ>`、内部用が `--_<プロパティ>`。
- スコープは `@scope (.scoped.<名前>) to (.scoped)`。
- コンテナは、ルートで `container: --scoped / inline-size` とし、`@container --scoped (…)` で問い合わせる。子要素をコンテナにするときは、クラス名から下線を除いた名前（`._body` → `--body`）にする。外側のコンポーネントのコンテナは問い合わせない。
- コンテナサイズクエリを書くのは、コンポーネントの中でフラグを宣言する1つのルールだけにする。その要素が `--_density: --compact`（既定値として明示）をクエリの中で `--spacious` に切り替え、ほかの子孫は `@container style(--_density: --spacious)` で切り替える。3段階が要るときだけ `--regular` を足す。
- ホバーとフォーカスで子要素や疑似要素を変えるときは、状態のセレクタで `--_hocus: --true`（既定値 `--false`）を立て、`@container style(--_hocus: --true)` で切り替える。要素自身の見た目は状態のセレクタに直接書き、子から親の向きは `:has()` を使う。状態のフラグの値は `--true` / `--false` にそろえる。
- ホバーは `&:any-link:hover` か `&:enabled:hover` に絞り、`@media (any-hover)` の中に書く（`<summary>` と `<label>` は除く）。
- ベーススタイルは `@layer base` の中に素のセレクタで書く。`:where()` で詳細度を0にするのは `@layer` を使えない場合（第19章）だけ。状態のセレクタをまとめるときは `:where()` ではなく `:is()` を使い、詳細度を残す。
- `border-box` を取り消すときは `box-sizing: unset` と書く。
- 要素の間のブロック方向の `margin` は、`& > * + *` や `& > :is(:heading, h1, h2, h3, h4, h5, h6) + *` のように次兄弟結合子で選んだ後ろの要素の `margin-block-start` に付ける。要素自身に条件なしの `margin-block-end` を付けたり、`:last-child` で打ち消したりしない。
- 高さは `block-size` で固定せず、`min-block-size`、`max-block-size`、`aspect-ratio` で決める。正方形は `inline-size` と `aspect-ratio: 1` で書く。
- デモの見た目は、共通トークン（`src/demos/tokens/`）で統一する。詳細と経緯は `DECISIONS.md` の「デモの共通トークンと見た目で決めたこと」にある。
  - 色：プリミティブ（`--color--neutral--*`、`--color--accent--*`、`--color--red--*`）は直接参照せず、セマンティクスを使う。面は `--background--base`／`surface`／`raised`／`overlay` の4段階を役割で選ぶ。枠線は `--border--base`。選んだ状態や範囲の淡い青は `--background--accent-subtle`、成功とエラーの文字は `--foreground--success` と `--foreground--danger`。
  - 文字色は `--foreground--base` と `--foreground--muted` の2つだけにし、`opacity` や半透明の色で薄くしない。青（accent）はリンク、フォーカスリング、選択した状態にだけ使い、主ボタンは文字色で塗る。
  - 背景が透明な項目のホバーと押下は、`background-color` に `--background--hover` と `--background--active` を指定する。背景色のあるボタンは相対カラー構文で明るさを変える。文字色で塗ったボタン（`--background--inverse`）は、`color-mix(in oklab, var(--background--inverse) 80%, var(--background--base))` でページの背景に寄せる。
  - 文字は役割のトークン（`--text--<役割>--font-size` と `--text--<役割>--leading`。役割は display、title、subtitle、body、body-compact、caption）で指定する。太さは `--font-weight--regular` と `--font-weight--bold` の2段階。
  - 角丸は `--rounded--sm`／`md`／`lg`／`full`（外側のパネルは `lg`、内側の項目は `md`）、影は `--shadow--*`、再生時間は `--duration--fast`（80ms）／`base`（160ms）／`slow`（240ms）。
  - 項目の間を移る背景を付けるリストは、項目の間に隙間を作らない。間隔は項目の内側の余白で作る。

## 章を書く手順

見本の章は第13章（`src/content/docs/responsive/`）。文体、節の構成、コード例とデモの見せ方、ルールの粒度は、これに合わせる。

1. 骨組みのページ（`draft: true` と「執筆予定」のメモ）を本文で置き換える。frontmatter の `title` と `sidebar.order` は変えず、`draft: true` を消して `description` を書き直す。
2. ルールを `src/content/rules/<章番号2桁>-<章のディレクトリ>.yaml` に書く（例：`09-notation.yaml`）。章の番号が変わったら、ファイル名も付け替える。ID はほかの章と重複させない（`grep -rn "id: <ID>" src/content/rules` で確認する）。
3. デモは `src/demos/<章のディレクトリ>/<デモ名>/` に `index.html` と `style.css` で置く。
   - デモの CSS も本書の規約で書く。`@layer` と `@scope (.scoped.<名前>) to (.scoped)` は省略しない。
     - 例外：CMS と共存する CSS のデモ（第19章）は `@layer` を使わない（ルール `no-layers-with-unlayered-css`）。
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
   - `node scripts/find-unnested-states.mjs <MDX や CSS のファイル>`：要素自身の状態をネストせずに連結しているセレクタ（ルール `nest-own-states`）。詳細度の説明などで連結を見せる例は、意図して残してよい
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
