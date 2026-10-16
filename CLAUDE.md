# RECSSガイドライン

CSS の記法と知識をまとめた日本語の技術書を、Astro Starlight で作っている。著者は TAK。書名の RECSS は Reasonable Enduring CSS の略で、「リーシーエスエス」と読む。Reasonable は理由を説明できること、Enduring は変化に強いこと（2-3 の保守しやすさ）、先頭の RE は基礎から学び直すことを表す（「本書について」の `## 書名について`）。RECSS は書名としてだけ使い、本文で方法論の名前として「RECSS では…」とは書かない。本書は AI に参照させるドキュメントも兼ねる。方針の詳細と経緯は `DECISIONS.md` にある（git の管理外なので、著者の手元のチェックアウトにだけある。新しいクローンやワークツリーにはない）。方針を変えるときは、先に著者に確認する。

## コマンド

- `pnpm dev`: 開発サーバー。下書き（`draft: true`）のページも表示される。
- `pnpm build`: 本番ビルド。下書きは除かれ、内部リンクが検証される。
- `pnpm lint:css`: サイトの CSS とデモの CSS を Stylelint で検証する。
- `pnpm lint:examples`: 原稿の 🙆‍♂ Recommended の CSS コード例を Stylelint で検証する。
- `pnpm lint:classes`: デモ、ひな形、原稿、サイトのコンポーネントの `class` 属性が、種類ごとに `|` で区切られ、決まった順に並んでいるかを検証する（ルール `group-classes-with-pipe`）。
- `pnpm lint:refs`: 原稿のリンクの文字列に書いた節番号、章番号、付録の記号とタイトルが、リンク先のページのタイトルと一致するかを検証する（更新履歴は対象外）。節や章を移したり、タイトルを変えたりしたら実行する。
- `pnpm lint:text`: 原稿を textlint で検証する。
- `pnpm list:markers`: 刊行前に解消する印（`要確認`、`要検証`）を種類ごとに一覧にする。`--summary` で件数だけを出す。
- `pnpm gen:exercise`: 第21章のデモから、演習を手元で進めるためのファイル（`public/exercise-files/`）を生成する。
- `pnpm gen:ai`: ルールと原稿から、AI 向けの配布物を生成する。ルールか原稿を変えたら必ず実行する。
  - コミットするもの：スキルとプラグイン（`plugin/`）、マーケットプレイス（`.claude-plugin/marketplace.json`）、MCP サーバーの `package.json` と README の版、第20章のひな形の配布ファイル（`public/ai-coding-files/`）
  - コミットしないもの：MCP サーバーが同梱するデータ（`packages/mcp/data/`）
- `pnpm gen:ai-kit`: 第20章のひな形（`src/kits/ai-coding/`）を、配布用に `public/ai-coding-files/` へ写す。`mcp.json` の本書の MCP サーバーの版を本のバージョンにそろえる。`pnpm gen:ai` の後にも実行される。ひな形を変えたら実行する。
- `pnpm test:mcp`: MCP サーバーを stdio で起動し、すべてのツールを1回ずつ呼んで確かめる（先に `pnpm gen:ai` を実行する）。

## ファイルの配置

- `src/content/docs/<章のディレクトリ>/`: 原稿。章のディレクトリと節のファイル名は URL になるので、構成を見直すとき以外は変えない。変えるときは、本文、ルールの `page`、更新履歴のリンクをすべて新しい URL に直す（公開前なので転送は置かない）。
  - 章の中にサブディレクトリを作らない。まとまりが大きくなったら、章を分ける。
  - `index.mdx` は章の概要ページ（`sidebar.order: 0`）。
  - 節は `sidebar.order` で並べる。
  - 第1〜20章の節（概要を除く）には、frontmatter に読み方の区別 `reading` を付ける。`basic`（基本：継続課題と演習の前半 21-2〜21-5 に要る節）、`applied`（応用：要件が出たときに選ぶ技法や新しい機能）、`reference`（参照：部品や症状に当たったときに手順や値を引く節）のどれか。前提や読む時期は `readingNote` に1文で書く。表示名は `src/lib/reading.mjs` にあり、節の冒頭（`src/components/PageTitle.astro`）、サイドバー（応用と参照だけ、`src/lib/route-data.ts`）、紙版の目次と節の冒頭、AI 向けの配布物に出る。付け忘れは `pnpm gen:ai` が止める。区別を変えたら、章の概要の `## 初めて読むとき`（基本の節を挙げる1文）も直す。
  - 「はじめに」（`introduction/`）は役割を分ける。「はじめに」（`preface`）は対象と成果（対象読者と前提、読み終えてできること、構成、4つの達成単位）、「最小の構成で始める」（`quick-start`）はカードを動かす課題と構成の参照、「本書の読み方」（`how-to-read`）は記号と検証環境（節の構成、初めて読む節の見分け方、ルールの強度と性質、コード例、デモ、Baseline、確認した環境）、「本書の成り立ち」（`about`）と「素のCSSで書く理由」はコラム。同じ案内を複数のページに書かない。
- `src/content/rules/*.yaml`: ルールの定義。書式は同じディレクトリの `README.md` を見る。各ルールに性質の `kind`（`spec`／`judgment`／`convention`）を付ける。
- `src/demos/<章のディレクトリ>/<デモ名>/`: デモの `index.html` と `style.css`。
  - 🙅‍♂ Not Recommended のデモは `style.bad.css` という名前にする（Stylelint の対象外になる）。
  - 悪い例と良い例、値の違いなどを比べるデモは、1つのデモの中に並べる（`data-*` 属性で片方だけ指定を変える）。比べる2つを別々のデモに分けない。
  - 状態の切り替えに JavaScript が要るデモは、`script.js` を置いて `<Demo js={…}>` に渡す。JavaScript のタブは出さない。CSS と HTML だけで作れるデモには使わない。
  - デモの `style.css` は、比べるために複数のコンポーネントを1つのファイルに書いてよい（ルール `one-component-per-file` の、デモだけの例外）。そのときは、`/** */` の説明ブロックをファイルの先頭の1つだけにし、途中のコンポーネントの前には `/* */` のコメントを置く。演習（第21章）のデモは、配布ファイルを `@scope` ごとに分けるので、`@scope` ごとの `/** */` を残す。
  - 見せるための足場（比べる区画を並べるグリッド、区画のラベルの文字サイズ、デモの枠の余白を外す `body` の指定）は `style.css` に書かない。区画を並べる要素に `data-demo-layout="compare"` を付け、枠の余白は `<Demo bleed>`（左右だけなら `bleed="inline"`）で外す。仕組みは `src/lib/demo.ts` の `DEMO_FRAME` にあり（演習の配布ファイルには入らない）、付録I に説明がある。それで表せない足場だけを `frame.css` に書き、`<Demo frame={…}>` に渡す（タブと AI 向けの配布物には出ない）。
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
- `plugin/`、`.claude-plugin/marketplace.json`: Claude Code のプラグインとスキル。レビューを分担するサブエージェントの定義（`plugin/agents/`、Codex 用は `plugin/codex/agents/`）も含む。どれも `pnpm gen:ai` が生成するので、直接編集しない（手順は `scripts/gen-ai.mjs` の `READER_BODY` と `JUDGE_BODY` にある）。定義にモデルは書かない。
- `src/kits/ai-coding/`: 第20章のひな形（タスクのスキル、brief と plan、フック、`.mcp.json`、テストの例）。本文では、ここから Starlight の `<Code>` に `?raw` で読み込み、本文に同じ内容を書き写さない。配布用のファイルは `pnpm gen:ai-kit` が作る。
- `src/kits/tasks/`: 第4、10、13、19章の「手を動かす課題」の答えの例。章ごとのフォルダー（`04-cascade/` など）には、前の章の答えから変えたファイルだけを置く。`scripts/gen-samples.mjs` が、本文から作る `quick-start/` に章の順に重ね、サンプル一式の `tasks/` に入れる。各章で足す部分は本文の「答えの例と解説」のコード例と重なるので、どちらかを直したら、もう一方も合わせる。
- `packages/mcp/`: npm に公開する MCP サーバー（`recss-guideline-mcp`）。版は本のバージョンと同じで、`.github/workflows/publish-mcp.yml` が、npm にまだない版を公開する（リポジトリの変数 `PUBLISH_MCP` が `true` のときだけ動く）。
- `astro.config.mjs`: ルールへのリンク（`/<page>/#rule-<id>`）は、ルールの定義と照らして正しいものだけをリンク検証から外している。
- `stylelint.config.mjs`、`stylelint/`: 本書の Stylelint 設定。本文で説明するルールと一致させる。

## 原稿の書き方（要点）

- 文章の規範は、スキル `japanese-tech-writing`（gist fd287c3133457c4fd8f5601d34aa817d）に従う。次の執筆スタイルと衝突したら、スキルを優先する。体裁（節の流れ、コード例のラベル、字数）は、このファイルの定めのままにする。
- 書いた後の推敲には、スキル `yomiyasu`（`.claude/skills/yomiyasu/`、nanaism/yomiyasu、MIT）を使う。書くときの規範は `japanese-tech-writing` のままで、`yomiyasu` は、非生物主語と比喩動詞、名詞の連続、過剰な装飾を直す推敲とリンターに使う。
  - 2つのスキルが食い違ったら、`japanese-tech-writing` とこのファイルの定めを優先する。否定対比は、読み手が実際に誤解しそうな解釈を退けるときだけ残す。
  - `yomiyasu` の対象は地の文だけにする。コードブロックとそのタイトル（`🙆‍♂ Recommended` の絵文字を含む）、インラインコード、MDX のコンポーネント、frontmatter、`prh.yml` の用語は変えない。
  - 推敲で主張や断定の強さ、事実を変えない。リンターの指摘が本書の定めと衝突したら、本書の定めを残す。
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
- 第21章（演習編、`exercise/`）は、架空の制作会社「エグザンプル・スタジオ株式会社」のコーポレートサイトを題材にする。21-1は題材と準備、21-2〜21-13は1つの節で1つの部品、21-14はページへの組み上げ、21-15は確認とレビュー。節には新しいルールを置かない。`## ガイドライン` の代わりに `## この節で使ったルール` を置き、使ったルールのIDを掲載ページへのリンク付きで並べる（例：`` [`density-via-style-query`](/components/style-queries/#rule-density-via-style-query) ``）。足りないルールは、著者に確かめてから本編の章に足す。
  - 演習の節は、本編の結論先行の例外として、最初の要件 → `## 予想する` → `## 合格条件`（前半を終えた時点のデモ）→ 解説 → `## 要件が変わる` → `## 変更後の合格条件`（後半を終えた時点のデモ）→ 解説 → `## 振り返り` → `## 判断の問い` の順にする。デモは1つの節に2つで、本文の後半には変更した箇所だけのコード例を置く。冒頭と `description` で直す箇所を言わない。振り返りでは、直す場所の数だけでなく、変更を受け持つ場所が予測できるか、影響範囲を確かめられるか、条件分岐が複雑になっていないかを問う。
  - デモは `src/demos/exercise/<節のスラッグ>-1/`（前半）と `-2/`（後半）に置き、`<Demo base="exercise" scheme="light">` で読み込む。`base="exercise"` は、共通トークンに演習のサイトのトークン（`src/demos/exercise/site-tokens.css`、紺とティール）を重ね、`src/lib/demo.ts` の `EXERCISE_BASE`（和文のカーニング、見出しの詰めと折り返し、下線の位置、二重のフォーカスリング）を足す。解説のデモの `DEMO_BASE` には足さない。ブランドの色は `--foreground--brand` と `--background--brand-subtle` で、accent はリンク、フォーカス、選択した状態にだけ使う。カンプの画像は載せず、寸法は本文に数値で書く。
  - 演習のサイトの見た目：ページは淡いグレー（`--background--base`）、カードやパネルは白（`--background--surface`）にし、カードは淡い線と `--shadow--card`（ホバーで `--shadow--card-hover`、位置は動かさない）で浮かせる。角丸は sm 6px／md 12px／lg 28px に上書きする。見出し、英字の小見出し、日付や価格の数字には、欧文の書体 Inter（`--font-family--latin`、`font-display: optional`）を使う。フォントの元のファイルとライセンスは `src/demos/exercise/fonts/` に置き、`pnpm gen:exercise` が配布物の `fonts/` に写す。
  - 各節の冒頭に、`public/exercise-files/<節のスラッグ>/` の開始版（`start/`）、中間版（`middle/`、デモの `-1`）、完成版（`finished/`、デモの `-2`）へのリンクを置く（ファイル名まで書く）。演習のデモを変えたら `pnpm gen:exercise` を実行する。開始版で空にするファイルは、`scripts/gen-exercise-files.mjs` の `SECTIONS` に書く。
  - 配布版は、デモの `style.css` を `@scope` ごとのファイル（`action-control.css` など）、`compositions.css`、`patterns.css`、`site-base.css`（デモの `@layer base`）に分けて生成する。`--<名前>--…` の `@keyframes` は、`<名前>.css` の先頭にレイヤーの外のまま置く。配布版のCSSには、すべてファイルの先頭に `/** */` の説明ブロックを置く。デモの説明ブロック（1行のコメントなら、それを変換したもの）を先頭へ移し、コンポジションの `@prop` は `compositions.css` の先頭に集める。デモに説明のないファイル（ページ、パターン、ベースの追加）は、`scripts/gen-exercise-files.mjs` の `FILE_DOCS` に説明を書く（ないと生成が止まる）。
  - JavaScript は、CSS と HTML だけでは作れない状態（よくある質問の絞り込み、フォームの `aria-invalid`）と、未対応のブラウザのためのポリフィル（ドロワーを開く `command` 属性の `invokers-polyfill`。対応していないときだけ、版を固定したCDNから読み込む）にだけ使う。
  - 演習デモのリンクは `href="#"` にせず、ページは `#<ページのスラッグ>`、記事は `#article-<スラッグ>`、カテゴリーは `#category-<スラッグ>` にする。
- 各ページが単体で意味が通るように書く。ほかのページに触れるときは、リンクと一言の要約を添える。
- 通読の流れもつなぐ。章の概要ページには、導入の段落の直後（節の一覧の前）に `## この章で判断できるようになること` を、末尾に `## 次の章へ` を、数文ずつ置く。節の一覧は `## この章の節` の見出しの下に置く。
  - 古い書き方からの移行がはっきりした章の概要には、導入の段落に「以前は〜、この章では〜」の段落を1つ置く（書名の RE）。置き換えの一覧は付録B（`appendix/modernize.mdx`）にあり、書名の RE から付録Bへ案内している。
  - `## 次の章へ` の直前（第21章は `## 付録へ` の直前）に `## この章の判断のまとめ` を置き、別の題材でも使える判断（症状や要件から、どこを見るか、何を選ぶか）を数文で書く。ルールIDの再掲や「この章で判断できるようになること」の繰り返しにしない。
  - 第4、7、8、9、10、13、17、19章の概要には、`## 最初に押さえるルール` の後に `## 判断の問い` を置く。問いは1つで、第9章だけは2つ（本書の命名で書く問いと、既存のBEMに合わせて本書の命名を持ち込まない判断を問う問い。それぞれ `###` の見出しを付ける）。答えと解説は `<details>` に入れる。第4、10、13、19章の問いは、「はじめに」（`introduction/preface.mdx`）の4つの達成単位を確かめる問いを兼ねるので、変えるときは単位の表も見直す。
  - 第4、10、13、19章の概要には、`## 判断の問い` の直後に `## 手を動かす課題` を置く。「最小の構成で始める」のお知らせのカードを、前の章の課題の答えから続けて直す課題で、要件、合格の条件（観察できる結果）、`<details>` に入れた答えの例と解説の順に書く。答えの最後に、サンプル一式の `tasks/<フォルダー>/` を案内する。課題を変えたら、`src/kits/tasks/`、「はじめに」の単位の表、紙版の `packages/book/config/volumes.mjs` の「身についたかを確かめる」も見直す。答えに観察した結果を書くときは、ブラウザで確かめたものだけにする。
  - 第14〜18章の概要と「最小の構成で始める」には、`## この章の実装を終えたら確かめること`（最小構成では `## 実装を終えたら確かめること`）を置き（概要では `## この章の判断のまとめ` の前）、その実装の終了条件だけを数文で書く。確かめ方は19-3にリンクし、繰り返さない。
- 複数の章に出てくる主張（内容は変わる、保守性を優先する、AI の出力を検証する、など）は、同じ説明を繰り返さず、その章が担う役割（なぜ／どこが受け持つか／どう耐えるか／どう確認するか）で書く。
- デモは操作しなくても結論が分かるように、直前か直後の本文に「何を変えると、どこがどう変わるか」を書く（AI は本文だけを読む）。
  - 紙の書籍では、デモは静止図になるか、番号と補足サイトへの参照になり（`packages/book/config/demo-selection.json` の `print`）、タブが外れる。本文にWeb版の操作の部品（「幅のボタン」「CSSのタブ」）を書かない。幅は「幅を320pxにすると」「768pxのときは」と書き（静止図のラベル「幅 Npx」と対応する）、デモのコードは「デモのCSS」「デモのCSSの全体」と書く。デモの中の部品の操作（ボタンを押すと、など）は書いてよい。
- コード例には、その見出しで説明している宣言と、それが働くのに要る宣言だけを書く（例：`gap` を説明するなら `display: block grid` と `gap`）。主題でない見た目（色、文字サイズ、角丸、`padding` など）は書かない。
  - 消した位置にほかの宣言があると読み手が知る必要があるとき（並び順を見せる例など）だけ、`/* ... */` を置く。
  - 🙅‍♂ Not Recommended の例も同じように削り、問題を起こしている宣言は残す。
  - 直下にデモがあるときは、デモの CSS の一部をそのまま抜き出した形にする。デモの `style.css` は削らない（足場を除く）。
  - 第21章（演習）は、1つのサイトを組み上げるコードなので対象外。
- コード例のラベル
  - コードブロックのタイトルに `🙆‍♂ Recommended: …` と `🙅‍♂ Not Recommended: …` を付ける。`…` には、何が問題か、何を解決したかが分かる日本語を書く（例：「同じ閾値を3か所で管理する」「閾値を1か所に集める」）。
  - Not Recommended の例は、先頭行にも `/* 🙅‍♂ Not Recommended */` と書く。
  - Recommended の CSS は、完全なルールとして書く（Stylelint で検証するため）。
  - コードフェンスの開始行に、区別の属性を書く（`src/lib/code-labels.mjs`。Web、紙版、AI 向けの配布物にタイトルの補足として出る）。
    - Recommended の `use`：省略すると `excerpt`（抜粋）。前の状態から変えた箇所だけなら `use="diff"`（第21章の後半、課題の答え）、そのファイルだけで動くなら `use="complete"`。
    - Recommended の `from`：全体のあるデモのディレクトリ（`src/demos/` からのパス、例：`from="values/fluid-heading"`）か、配布ファイル（`exercise-files/…`、`tasks/…`）。抜粋は、`from` のデモの CSS の行をそのまま使う。デモ番号は書かない（紙版が掲載順から付ける）。
    - Not Recommended の `issue`（必須）：表示、操作、アクセシビリティ、性能に問題が出るなら `behavior`（動作の問題）、いまの表示は正しいが本書の規約や設計の判断と異なるなら `convention`（規約との差）。
    - `pnpm lint:examples` が、値と `from` の指す先と `issue` の付け忘れをエラーに、抜粋とデモの食い違いと、デモがあるのに `from` がない抜粋を警告にする（一覧は `LINT_EXAMPLES_VERBOSE=1`）。
- 省略は `/* ... */` と書く。和文と英数字の間にスペースを入れない。
- 用語の表記は `prh.yml` に合わせる。
  - セレクタ、ブレイクポイント、コンテナクエリ、プロパティ、ブラウザ、ユーザー、レイヤー、デフォルト
  - サイズを問い合わせる `@container` は「コンテナサイズクエリ」と書く。「コンテナクエリ」は、サイズ・スタイル・スクロール状態の問い合わせの総称にだけ使う。
- 確かめた年月とブラウザやツールの版は、本文に書かない。「本書の読み方」の `## 確認した環境` にまとめ、確かめる環境が変わったら、そこを更新する。機能の対応状況は `<Baseline id="…" />` で示す。
  - 本文には、試したブラウザの名前だけを書く（「Chromeで確かめたところ」）。「（2026年10月確認）」「2026年10月の時点では」「Chrome 152で」のようには書かない。
  - 例外：対応した版そのもの（「Safari 26から」「Chrome 143以降」）、出来事の年月（「2026年5月にBaselineになった」）、1つの環境でしか試していないことが結論に関わる断り（「Chrome 153と154でだけ確認しています」）、確認した時期が「確認した環境」と異なる記述、AIツールと本書の配布物の状況。
  - 情報源で確かめたものは、年月を付けずに情報源を書く（「（MDNのブラウザ互換性データで確認）」）。
- 刊行前に解消する点には、種類ごとの印を付ける。詳細は種類の後ろに「。」で続ける（例：`{/* 要検証: ブラウザ。強制カラーモードでの表示 */}`）。
  - `{/* 要確認: 出典なし */}`：著者の資料に出典のない内容
  - `{/* 要確認: 著者の判断 */}`：著者に選んでもらう点
  - `{/* 要検証: ブラウザ */}`：ブラウザで確かめていない挙動
  - 原稿の外のファイルでは、そのファイルのコメントで書く（`README.md` は `<!-- 要確認: … -->`、`astro.config.mjs` は `// 要確認: …`）。`pnpm list:markers` が調べるのは、原稿と、`scripts/list-markers.mjs` の `EXTRA_FILES` に並べたファイルなので、ほかのファイルに印を付けたら、そこに足す。
- MDX の地の文では `<` と `{` がコードとして解釈される。HTML タグや CSS は必ずバッククォートで囲む。

## CSS の書き方（本書のルールの要点）

本書のサンプルとサイトの CSS は、本書のルールに従う。詳しいルールは `src/content/rules/*.yaml` と各章にある。

- 論理プロパティ、`display` の2値構文（`block flex`）、変形の個別プロパティ（`translate` など）を使う。
- クエリは範囲構文で書き、閾値は `calc(640 / 16 * 1rem)` の形にする。幅を足し合わせる式では、各項をその値を宣言した単位で書く（rem の幅は `… / 16 * 1rem`、px の `gap` や `padding` は px のまま。例：`calc(560 / 16 * 1rem + 240 / 16 * 1rem + 32px)`）。`vw` と `vh` は使わない。
- ネストは1段で、先頭に `&` を書く。`@media` と `@container` は各セレクタの中に書く。
- 子要素のクラスの下の要素を、タイプセレクタで選ばない（`._section p` は不可、要素にクラスを付ける）。直下の要素を選ぶときは、子要素のクラスのルールの中にネストして `& > p` と書く（`._section > p` と並べて書かない）。ネストに書くのは親のレイアウトで決まる宣言だけ。
- 命名
  - ルートは `scoped <名前>`、子要素は `._kebab`、ユーティリティは `.-kebab`。
  - 1つの要素に種類の違うクラスを付けるときは、「ルート | 子要素 | コンポジション | パターン | ユーティリティ」の順に `|` で区切る（例：`class="_tags | cluster"`）。
  - カスタムプロパティは、公開用が `--<コンポーネント>--<プロパティ>`、内部用が `--_<プロパティ>`。
  - スペーストグルの変数は `--_if-<フラグの値の名前>`（`--_if-spacious` と `--_if-compact`）。オンは `initial`、オフは空白1文字。`if()` に未対応の環境でも同じ表示が要る2値の分岐にだけ使う（ルール `space-toggle-until-if`）。
- スコープは `@scope (.scoped.<名前>) to (.scoped)`。
- コンテナは、ルートで `container: --scoped / inline-size` とし、`@container --scoped (…)` で問い合わせる。子要素をコンテナにするときは、クラス名から下線を除いた名前（`._body` → `--body`）にする。外側のコンポーネントのコンテナは問い合わせない。
- コンテナサイズクエリを書くのは、コンポーネントの中でフラグを宣言する1つのルールだけにする。その要素が `--_density: --compact`（既定値として明示）をクエリの中で `--spacious` に切り替え、ほかの子孫は `@container style(--_density: --spacious)` で切り替える。3段階が要るときだけ `--regular` を足す。
- ホバーとフォーカスで子要素や疑似要素を変えるときは、状態のセレクタで `--_hocus: --true`（既定値 `--false`）を立て、`@container style(--_hocus: --true)` で切り替える。要素自身の見た目は状態のセレクタに直接書き、子から親の向きは `:has()` を使う。状態のフラグの値は `--true` / `--false` にそろえる。
- ホバーは `&:any-link:hover` か `&:enabled:hover` に絞り、`@media (any-hover)` の中に書く（`<summary>` と `<label>` は除く）。
- ベーススタイルは `@layer base` の中に素のセレクタで書く。`:where()` で詳細度を0にするのは、`@layer` を使えない場合（第19章）のベーススタイル、上書きされる前提のデフォルト値、直下の子をネストで選ぶときに詳細度を上げたくない場合（`& > :where(._child)`、4-2）に限る。状態のセレクタをまとめるときは `:where()` ではなく `:is()` を使い、詳細度を残す。
- `border-box` を取り消すときは `box-sizing: unset` と書く。前の値（ブラウザのデフォルト、リセット、ベース、前のルール）を打ち消すときは、`0` や `none` ではなく `unset`、`revert`、`revert-layer`、`initial` のうち戻したい先に合うキーワードで書く（ルール `explicit-rollback-keyword`）。打ち消しが要らない値は、宣言ごと書かない。`0` そのものがデザインの値なら `0` のままにする。
- 親の配置で意味が決まる宣言（`flex*`、`grid-area`、`align-self`、`float`、`shape-outside`、`position: absolute` と `inset`、コンポーネントの中の要素を基準にする `position: sticky`、`scroll-snap-align`、`break-inside`、外側の `margin`（`auto` と負の値を含む））は、親のルールの `& > ._child` や `& > .scoped` のネストに書く（ルール `nest-child-placement-only`、`parent-owns-child-placement`）。ページのルートのスクロールに沿わせる `sticky` と、`position: fixed` は例外。子要素の大きさは子のルールに、子のコンポーネントの大きさは置く側のネストに書く。
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
   - `python3 .claude/skills/yomiyasu/scripts/yomiyasu_lint.py <MDX ファイル>`：原稿の比喩動詞、名詞の連続、過剰な装飾（スキル `yomiyasu`）。コード例のラベルの絵文字への指摘は無視する。`sentence_end_repetition`（です・ます調では文末が続く）、`negative_parallelism` と `negative_parallelism_density`（技術的な区別の否定対比）、`excess_list`（章の概要の節の一覧）は本書の文体と合わないので見ない。比喩、語彙、前置きの指摘だけを推敲の候補にし、文字どおりの意味で使っている語は残す。ソフトウェアの「版」は本書の用語なので、`translated_term` の「版」の指摘は無視する（「メジャーバージョン」「バージョン番号」「バージョン管理」のような複合語はバージョンと書く）。「土台」は、リセットCSSとベーススタイルを指す場合と「〜をもとに作る」の意味では残し、「判断の土台」のような抽象的な比喩では使わない。「効く／効かない」は、困りごとの名前（見出し、付録Kや19-4の表、「宣言が効かない」「効かない指定」のように症状を呼ぶとき）にだけ使い、仕組みの説明では、何が起きるかに合わせて「適用されない」（カスケードで負ける、条件に合わない）、「働かない」（レイアウトの方式などで、適用されても影響しない）、「反映されない」（値が表示に出ない）と書く
   - `node scripts/find-unnested-states.mjs <MDX や CSS のファイル>`：要素自身の状態をネストせずに連結しているセレクタ（ルール `nest-own-states`）。詳細度の説明などで連結を見せる例は、意図して残してよい
   - `node scripts/find-type-under-child.mjs <MDX や CSS のファイル>`：子要素のクラスの下をタイプセレクタで選んでいるセレクタ（ルール `no-type-under-child-class`）。CMSの本文のようにクラスを付けられない領域は、意図して残してよい
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
