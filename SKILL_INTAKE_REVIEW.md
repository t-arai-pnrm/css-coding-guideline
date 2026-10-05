# 外部スキルの取り込み候補（2026-10-05）

## 総評と調査範囲

GoogleChrome の modern-web-guidance と、Emil Kowalski の skills を読み、本書の原稿・ルール（512件）・生成したスキルと照らし合わせた。どちらのスキルも、CSS についての勧めの大半は本書がすでにルールつきで扱っており、規約は本書のほうが厳格である。足りないのは、本文にあるのにルールになっていない項目と、少数の新しい機能・技法である。

取り込みの方針は次のとおり（著者と合意済み）。

- 範囲は CSS と、CSS と組み合わせて使う HTML。Web Components と表のスタイリングも対象にする。
- スキルは話題を見つける手がかりとしてだけ使う。内容は仕様・MDN・ブラウザでの確認で裏付け、本書の参考リンクには挙げない。コードは写さず、本書の規約で書き起こす。
- 本書のルールと食い違う助言は、本書を優先し、この報告には載せない（裸の `:hover`、`(hover: hover) and (pointer: fine)`、`dvh`/`vw`、物理プロパティ、`transform:` の関数、`reduce` の中で打ち消す書き方、`scrollbar-color`、`will-change` を置いたままにする、など）。
- 対応状況の扱いは DECISIONS.md の方針（2025年以降に Baseline になったものと一部のブラウザで出荷済みのものを扱い、Baseline でないものはプログレッシブ・エンハンスメントで書く）に従う。

**注意**：`git clone` が権限で拒否されたため、両リポジトリは GitHub API でファイルの一覧を取り、各ファイルを WebFetch で読んだ。WebFetch は要約を挟むので、数値・構文・ブラウザのバージョンには誤りが混じりうる。原稿に反映するときは、原文と仕様で確かめること。Baseline の時期は `node_modules/web-features` で確認した。

優先度は、「高」が本書に欠けていて実務への影響が大きいもの、「中」が既存の節を補うもの、「低」が小さな補足か対応ブラウザが限られるもの。

## 1. ルール化の候補

本文やチェックリストにはあるのに、ルールの ID がない項目。AI が誤りやすく、両スキルが強く打ち出している。

### 1-1 高：UI の動きに ease-in を使わない（仮 ID：`no-ease-in-for-ui`）

- 置き場所：17-3 イージングと再生時間（`17-motion.yaml`）
- 現状：本文（`in` 系で消すと遅れて見える）と付録のチェックリストにある。ルールはない。
- 案：強度は「禁止」か「非推奨」。`aiProne: true`。例外（画面の外へ出ていくものを加速させる場合など）を設けるなら note に書く。

### 1-2 高：機能的な動きの再生時間の上限（仮 ID：`functional-motion-under-300ms`）

- 置き場所：17-3
- 現状：本文の表（押下100〜150ms、メニュー300ms以下、大きな UI 300〜500ms）とチェックリストにある。チェックリストは `transition-longhand-with-tokens` を代わりに参照している。
- 案：「操作に応じる動きは300ms以下、画面の大部分を覆う UI でも500ms以下」。`--duration--reveal` と `--duration--spring` は例外として note に書く。チェックリストの参照先を新しい ID に直す。

### 1-3 高：`@import` はビルド時に展開する（仮 ID：`import-resolved-at-build`、必須）

- 置き場所：2-3 カスケードレイヤーで順位を決める（`02-cascade.yaml`）
- 現状：`import-into-layer`（推奨）と本文は `@import url() layer()` を勧めているが、ブラウザでそのまま実行してよいかには触れていない。
- 著者の方針：ブラウザでの `@import` は読み込みが直列になり、性能を著しく落とすので禁止する。フレームワークや PostCSS のプラグインなどで、ビルド時に必ず展開する。
- 案：`import-into-layer` は「`layer()` で割り当てる」書き方のルールとして残し、配信の方法は新しいルールに分ける。2-3 の本文に、理由と、ビルドで展開する前提を足す。
- 確認済み：Astro などのフレームワークでは、ビルド時に展開される（著者が確認）。
- 残る判断：CMS と共存する CSS（第18章）のように、ビルドを通さずに配信する場合の扱い（1ファイルにまとめてから配信する、など）を本文かルールの note に書く。CodePen のようなデモの環境で CDN から `@import` するのは、配信ではないので対象外と note に書いておくと、AI が著者の CodePen を読んだときに迷わない。

## 2. 取り入れる候補

### 2-1 高：表のスタイリング（新しい節の候補）

- 現状：本書に `<table>` のスタイリングの記述がない。10-7 で表の「→」の案内に触れるだけ。
- 内容：見出しのセルを `position: sticky` で留める（`border-collapse: separate` が必要な理由も書く）、スクロールのラッパー（`overflow-x` ではなく `overflow-inline`、`scrollbar-gutter`、スクロールできることの手がかり）、狭いときに縦に積む、`tabular-nums` で数字の幅をそろえる、`caption` と `th` の `scope`。コンテナの名前、`calc()` の閾値、論理プロパティは本書の規約で書く。
- 置き場所の案：10-7 positionの基礎の後ろ、第11章の作例、第16章の新しい節のいずれか。著者が決める。
- 根拠：modern-web-guidance の ui-components/responsive-table。

### 2-2 高：Web Components のスタイリング

- 方針（著者と合意済み）：基本は Light DOM のカスタム要素とし、Shadow DOM は限られた場面で使う。
- 出典：著者の CodePen 3本（Theme Toggle、メガメニュー、View Transition Lightbox）。要点は `.notes/codepen/web-components.md` にまとめた。

**著者の実践から読み取れること**

1. **カスタム要素をコンポーネントのルートにする**。`<image-lightbox class="scoped">` のように、カスタム要素そのものに `scoped` を付け、`@scope (image-lightbox.scoped) to (.scoped)` で閉じる。クラス名の代わりに要素名がコンポーネント名になる。ルートでは `display: block flow` を明示する（カスタム要素の既定は `inline` のため）。
2. **JS がなくても動く HTML を先に作る**。開閉は `popover` と `popovertarget`、モーダルは `<dialog>` と `command`/`commandfor`、`closedby="any"` で、ブラウザの機能だけで動く。カスタム要素は、ホバーで開く、フォーカスが外れたら閉じる、View Transitions でつなぐ、設定を保存する、といった上乗せだけを受け持つ。ホバーで開くのは `matchMedia("(hover: hover)")` が真で、かつ `hoverable` 属性があるときに限る。
3. **状態はブラウザの擬似クラスで選ぶ**。`:popover-open`、`:has(:popover-open)`、`:checked` を使い、`:state()` は使っていない。JS が持つ状態は `data-*` 属性（`dataset.value`）に出す。
4. **設定は属性とカスタムプロパティで受け取る**。振る舞いの設定は属性（`hoverable`、`observedAttributes`）、見た目の設定は公開カスタムプロパティ（`--image-lightbox--thumbnail-aspect`）で受け取る。本書の8章の命名がそのまま使われている。
5. **Shadow DOM は、中身をすべて自分で描く部品に使う**。`<theme-toggle />` のように、ページから子要素を受け取らず、ボタンやポップオーバーの HTML をコンポーネントが生成するものは、`attachShadow({ mode: "open" })` で閉じ込める。CSS は `<template>` の中の `<style>` に書いて複製する。
6. **Shadow DOM の中の書き方**。`:host` に内部用のカスタムプロパティ（`--_background: light-dark(var(--color--lightest), …)`）と `display: block flow` を書く。ページのトークン（`:root` のカスタムプロパティ）は継承で Shadow DOM の中に届くので、それを使う。中の要素は、クラスや `@scope` を使わずに、要素とその属性のセレクタで選ぶ（境界の外に漏れないため）。ページのユーティリティ（`.-visually-hidden` など）は Shadow DOM の中に届かないので、中で同じ指定を書く。ネスト、`@media (any-hover)` の中の `:enabled:hover`、`no-preference` の中の動き、`@starting-style` は、Light DOM と同じ規約で書く。

**本書に書くこと**

- Light DOM：要素名をルートのセレクタにする `@scope (<要素名>.scoped) to (.scoped)` の書き方、ルートの `display` の明示、JS がなくても動く HTML を先に作る順番、状態をブラウザの擬似クラスと `data-*` で選ぶこと。`:not(:defined)` の扱いは 3-7 にすでにある（隠さずに場所を確保する）ので、そこへリンクする。
- Shadow DOM：使う場面の判断（ページから子要素を受け取るなら Light DOM、中身をすべて自分で描くなら Shadow DOM）、`:host` に書くもの、トークンは継承で届くがユーティリティとリセット（kiso.css）は届かないこと、中ではクラスや `@scope` が要らないこと、`<template>` の `<style>` で持たせる方法。
- 著者の CodePen にない内容（`::part()` と `exportparts`、`::slotted()`、`:state()`、Shadow DOM の中の `@layer`）は、要確認として扱うか、書かない。
- 置き場所の案：第8章に新しい節（例：8-6 Web Components）を置き、2-4 @scope に「Shadow DOM との使い分け」を一段落で足す。ルール化の候補は「カスタム要素のルートに `display` を明示する」「JS がなくても動く HTML を先に作り、カスタム要素は振る舞いの上乗せにとどめる」「子要素を受け取る部品は Light DOM で作る」。
- 見直しが必要な決定：DECISIONS.md の234行目（「Shadow DOM（`:host`）を前提にした例は使わず、`@scope` とクラスの命名で書き直した」）。ネストの判断基準の節での判断なので、それ自体は残してよいが、Shadow DOM を使う場面があることと矛盾しないように書き添える。
- 著者に確認したいこと：3本とも、要素の中に `<style>` を置いて `@scope to (.scoped)`（古い版は `.scope`）で閉じる書き方を使っている（Theme Toggle のコンポーネント、Lightbox の `header` と `main`）。v0.18.0 で「ルートの中の style」を 2-4 から取り除いた判断と食い違うので、本書の Web Components の節では、今の書き方（外部の CSS に `@scope (<要素名>.scoped) to (.scoped)`）にそろえてよいか。クラス名は今の `scoped` にそろえる前提にする。

### 2-3 高：`content-visibility: auto` で画面外の描画を後回しにする

- Baseline：low（2025-09）
- 現状：10-7 で包含ブロックを作る指定として触れるだけ。`contain-intrinsic-size` は本文にない。
- 内容：折り返しより下の大きなブロックに `content-visibility: auto` と `contain-intrinsic-block-size: auto <値>` を組で指定する、最初の画面には使わない、ページ内検索とキーボードで届くか確かめる、`hidden="until-found"` との使い分け。サイズは物理の `contain-intrinsic-size` ではなく論理の longhand で書く。
- 置き場所の案：17-7 動きの負荷を抑える（`contain` の節の隣）か、10-10 変化に強いレイアウト。ルール化の候補でもある。

### 2-4 高：`::highlight()` と CSS Custom Highlight API

- Baseline：low（2026-03）
- 現状：記述なし。
- 内容：使えるプロパティの制限（色、背景、文字の装飾など）、アクセシビリティツリーに出ないので意味のある強調は `<mark>` を使う、色だけで区別しない、強制カラーモードでの見え方。
- 置き場所の案：3-8 生成コンテンツと装飾の擬似要素。

### 2-5 高：`sibling-index()` と `sibling-count()`

- Baseline：low（2026-08）
- 現状：1章で名前に触れ、`no-unsupported-layout-features` の note で装飾に限って許すだけ。
- 内容：ずらして再生する（`animation-delay: calc(sibling-index() * …)`）、色相を順に変える、3-5 数量クエリとの使い分け、`@supports` での保険。
- 置き場所の案：3-4 子要素の位置で選ぶか 4-3 計算関数。ずらして再生する例は 17-5（2-10 と合わせる）。

### 2-6 高：頻度と操作の起点で、動かすかどうかを決める

- 現状：17-1（`motion-needs-purpose`）に頻度の考え方はあるが、段階の目安とルールはない。`no-motion-on-focus-visible` はフォーカスの移動だけを対象にしている。
- 内容：使う頻度の目安（1日に何十回も使う操作は動かさないか最小限にする、まれな操作は演出してよい）。キーボードで起こした操作（ショートカット、コマンドパレットの開閉）は動かさない。
- 置き場所の案：17-1。`motion-needs-purpose` の note を広げるか、キーボード起点を別のルールにする。

### 2-7 高：`font-size-adjust: from-font` で代替フォントの大きさをそろえる

- Baseline：low（2024-07）
- 現状：13-1 は `@font-face` の `size-adjust` などで補正する（`fallback-font-metric-overrides`）。`font-size-adjust` はない。
- 内容：`size-adjust` との使い分け（Web フォントの読み込みの前後のずれか、混植で字面の大きさをそろえるか）、`cap-height`/`ch-width`/`ic-height` の選び方。和文での `ic-height` の効き方は要確認。
- 置き場所の案：13-1 フォントを指定する。

### 2-8 高：コンポーネント単位の `color-scheme`

- 現状：14-4 はデモで要素ごとに指定するだけ。
- 内容：一部のコンポーネントだけを `color-scheme: dark` にするとき、継承する色（`color` など）をその要素で指定し直す必要があること、トークンを `@property` で `<color>` として登録すると `light-dark()` が計算済みの値で固まること、Safari は iframe に `color-scheme` を引き継がないこと、`::placeholder` や `::selection` などの擬似要素にも `light-dark()` のトークンを使うこと。
- 置き場所の案：14-4 ダークモード。

### 2-9 中：ツールチップの2回目以降は、遅延だけでなく動きも省く

- 現状：17-5 に「ツールチップの表示を遅らせる」がある。2回目以降に動きそのものを省く点はない。
- 内容：隣のツールチップに移ったときは、遅延と `transition-duration` をどちらも0にする。
- 置き場所の案：17-5 出現と退場。

### 2-10 中：頻度の低い UI でのずらし方

- 現状：頻度の高い UI でずらす例は Not Recommended（17-1）。ずらしてよい場面と、その書き方はない。
- 内容：ずらす間隔は30〜80ms と短くし、全体が終わるまで操作を妨げない。`sibling-index()`（2-5）か、`--_index` を `style` 属性で渡す方法で書く。
- 置き場所の案：17-4 か 17-5。

### 2-11 中：ぼかしでクロスフェードの粗を目立たなくする

- 現状：17-7 はぼかしの負荷を定性的に書くだけ。
- 内容：二つの状態を重ねて切り替えるときに `filter: blur()` を数px だけ掛けて、途中の二重写りを目立たなくする。大きなぼかしは負荷が高いので、値の目安（20px 未満）を 17-7 に足す。数値は要確認。
- 置き場所の案：17-8 View Transitions か 17-4。

### 2-12 中：切り詰めの方針

- 現状：`line-clamp-with-overflow-clip` だけで、`text-overflow` は本文に1件もない。`tabular-nums` はユーティリティの例だけ。
- 内容：1行の切り詰め（`text-overflow: ellipsis`）、切り詰めた全文を見る手段を用意する、数値や金額は切り詰めない、表や数値の列には `font-variant-numeric: tabular-nums`。
- 置き場所の案：10-10 変化に強いレイアウトか 13-4 文字サイズと改行。

### 2-13 中：操作部品の `user-select: none`

- 現状：7章の本文に出てくるだけで、ルールはない。kiso.css にもない。
- 内容：ボタンやタブのように、長押しや連打で文字が選択されて困る操作部品にだけ指定する。本文の文字や `body` には指定しない。
- 置き場所の案：16-1 状態とフォーカスを表す。

### 2-14 中：スケルトンを最終の寸法に合わせる

- 現状：記述なし。
- 内容：読み込み中の表示（スケルトン）を、読み込み後と同じ寸法（`aspect-ratio`、`lh` 単位の行の高さ）にして、周りをずらさない。スピナーで場所を取り直さない。スケルトンの明滅は `motion-only-with-no-preference` に従う。
- 置き場所の案：10-10 変化に強いレイアウト。

### 2-15 中：カスタマイズ可能な `<select>`

- 現状：16-3 と第3章の概要で、対応ブラウザが限られることに触れるだけ。
- 内容：`appearance: base-select`、`::picker(select)`、`::picker-icon`、`option::checkmark`、`<selectedcontent>`、`:open`。未対応の環境では今の `<select>` のスタイルに戻る書き方にする。Firefox が対応したら節として広げる。
- 置き場所の案：16-3 フォーム部品。

### 2-16 中：スクロール駆動アニメーションの `@supports` の条件

- 現状：17-6 の判定は `@supports (animation-timeline: scroll())` だけ。
- 内容：`animation-range` に対応しない環境を除くため、`@supports (animation-timeline: view()) and (animation-range: entry)` のように両方を条件にする。`animation-timeline` は `animation` の shorthand の後ろに書く理由も足す。
- 置き場所の案：17-6 スクロールに合わせて動かす。

### 2-17 低：小さな補足

- `text-wrap: balance` を、枠や背景のある要素や全称セレクタに指定しない（13-4）。
- `position: sticky` で留まると大きさが変わる要素の揺れを、`overflow-anchor: none` で防ぐ（10-7）。
- `transition-behavior: allow-discrete` を shorthand に入れず longhand で書く理由（未対応の環境が宣言ごと捨てる）を、`transition-longhand-with-tokens` の reason に足す（17-4）。
- `linear()` のばねの動きを `opacity` に使わない（値が範囲を超えるため）（17-3）。
- 文字サイズの `clamp()` は、最大値を最小値の2.5倍以内にする（ブラウザの拡大で WCAG 1.4.4 を満たすため）（4-3）。数値は要確認。
- `touch-action` は対象を絞り、ページ全体に `none` を指定しない（16-1）。
- `scale` は子要素も一緒に縮めるので、押した感じが出る、という一文（17-3）。
- ドロワーのように大きく滑り込む UI 用のイージングのトークン（8-4）。
- スクロールできる領域の端を、線ではなくマスクのグラデーションで薄くする（15-1）。
- `clip-path` で切り抜く技法：タブの列を2つ重ね、選んだタブの範囲だけを切り抜いて色を切り替える。本書は `clip-path` のアニメーションでペイントが起きるものとして扱うので、動かさない切り抜きとして書く（15-1 か 15-2）。

### 2-18 低：一部のブラウザでだけ出荷済みの機能

DECISIONS.md の方針では扱える範囲だが、いまは Chrome だけのもの。触れるだけにするか、対応が広がってから書く。

- `calc-size()`：直前に普通の値を書いて保険にする（4-3、17-5）。
- `@function`：重複を減らす（4-3）。
- `overflow-clip-margin: content-box`（10-10）。
- `scroll-initial-target`、`scroll-target-group` と `:target-current` のスクロールスパイ（10-12、16-4）。
- `container-type: anchored` と `@container anchored(fallback: …)`（10-7）。

## 3. 本書の根拠の補強

助言は取り入れないが、本書とスキルの両方を読んだ AI が迷いやすい点。ルールはそのままにして、本文の説明を厚くする。

### 3-1 `contrast-color()` より `sign()` を優先する理由

- 該当：14-3 背景から文字色を決める（`prefer-sign-over-contrast-color`）
- 食い違い：modern-web-guidance は `contrast-color()` を本命とし、相対カラー構文と `sign()` を保険にしている。保険の式の閾値も、本書の0.7に対して0.623である。
- 補強の案：本書の reason（WCAG 2.x のコントラスト比で選ぶので中間の明度で読みにくいほうを選ぶことがある）に加え、閾値の0.7をどう決めたかを本文に書く。ほかの閾値（0.623 など）を見かけたときに、どちらを選ぶかの判断の材料になる。閾値の根拠が著者の資料にない場合は、要確認として残す。

## 4. 対象外

CSS の本の範囲から外れるもの、または著者と対象外にすると決めたもの。

- JS とフレームワーク：Motion（Framer Motion）のばね、React のパターン、ジェスチャーとドラッグの計算、`pointerdown` で反応する処理、Temporal、scheduler、`scrollend` など。
- React Native（animate-expo）、Swift（write-swift）、Sonner の API（ask-sonner）、UI ライブラリの選び方、プロトタイプと監査の手順。
- HTML と性能の細かい規則：speculation rules、`blocking="render"`、`fetchpriority` と preload の詳細、`autocomplete` のトークン一覧。
- `<meta name="theme-color">`：HTML の `meta` で、CSS と組み合わせて使うものではないため。
- 長押しで削除するボタン：キーボードで操作できないなど、アクセシビリティの問題があるため。
- 工程の話（翌日に見直すなど）と、デザインの原則（apple-design の Purpose、Agency など）：著者の資料に裏付けがないため。
- セキュリティ、プライバシー、PWA、Wasm、WebMCP、built-in AI、HTML-in-Canvas、chrome-extensions。

## 5. MCP サーバーでの提供（設計案）

### 5-1 結論

別のプロジェクトから MCP サーバー経由で使うことはできる。規範（どう書くか）は今のスキルに残し、MCP は**検索と検査**に絞って足すのがよい。検査だけが目的なら、Stylelint 設定を npm パッケージにするほうが簡単である。

### 5-2 今のスキルの限界

- `rules.md` は512件、約520KB ある。SKILL.md の Step 1 は「`rules.md` を読む」としているが、全体を読み込むとコンテキストを大きく消費し、ツールによっては一度に読めない。「AIが誤りやすいルール」（約240件）だけでも大きい。
- 「詳細」のリンクがローカルのファイルパス（`/Users/araitakahiro/...`）なので、このマシンの外では読めない。
- 規範に従ったかを確かめる手段が、最終確認のチェックリストしかない。

### 5-3 ツールの案

| ツール | 入力 | 返すもの |
|---|---|---|
| `search_rules` | 語句、章、強度、`aiProne` | 該当するルールの ID、強度、本文、理由（必要な分だけ） |
| `get_rule` | ルールの ID | ルールの全項目と、詳細ページの URL |
| `get_section` | ページ（`motion/easing-and-duration` など） | 節の本文（MDX をテキストにしたもの）とコード例 |
| `lint_css` | CSS の文字列 | 本書の Stylelint 設定での違反と、対応するルールの ID とリンク |
| `list_ai_prone` | 章（任意） | AI が誤りやすいルールの一覧 |

データは `src/content/rules/*.yaml` と原稿を読むだけでよい。`gen:ai` と同じ元データを使うので、二重の管理にはならない。`lint_css` は `stylelint.config.mjs` と `stylelint/` の独自プラグインをそのまま使う。

### 5-4 配布方法

- **ローカル（stdio）**：npm パッケージとして公開し、使う側の `.mcp.json` に `npx` で起動する設定を書く。バージョンを固定でき、ネットワークが要らない。更新は使う側でバージョンを上げる。
- **リモート（HTTP）**：GitHub Pages は静的なので、そのままでは置けない。Cloudflare Workers などに置けば、1か所の更新ですべてのプロジェクトに反映される。`lint_css` を動かすには Node が要るので、ローカルより構成が重い。
- 公開前の今は、ローカル（stdio）から始めるのが現実的である。

### 5-5 スキル・MCP・npm パッケージの比べ方

| | スキル | MCP サーバー | Stylelint 設定の npm パッケージ |
|---|---|---|---|
| 役割 | 書き方の規範と進め方を作業ごとに反映させる | 必要なルールを引く、コードを検査する | コードを検査する |
| 使える環境 | Claude Code が中心（SKILL.md に対応するエージェントは増えている） | MCP に対応したクライアント全般 | エディター、CI、どの AI でも |
| 検査の確実さ | なし（AI の自己確認） | あり（ツールを呼べば） | あり（CI で必ず通る） |
| 弱いところ | 規範を守ったかは確かめられない | AI が呼ばないと何も起きない。サーバーの保守が増える | 検出できるルールが一部に限られる。理由や背景は返さない |

### 5-6 組み合わせの案

1. スキルの Step 1 を「`rules.md` を全部読む」から「AI が誤りやすいルールと、タスクに関係する章のルールを読む」に変え、`rules.md` を章ごとのファイルに分ける。MCP がなくても効果がある。
2. 詳細ページへのリンクを、公開した URL（GitHub Pages）に向ける。
3. Stylelint 設定を npm パッケージにして、CI で検査できるようにする。
4. そのうえで、Claude Code 以外のクライアントでも使いたくなったら、MCP サーバー（`search_rules`、`get_rule`、`lint_css`）を足す。Claude Code では、スキルと MCP を1つのプラグインにまとめて配ることもできる。
