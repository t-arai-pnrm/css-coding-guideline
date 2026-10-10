# 第15章 色：ルール

- ガイドラインのバージョン: 0.47.4（2026-10-10 生成）
- ルールの数: 23
- 本文: 約8.7万字
- 読む条件: 色の指定（oklch()、color-mix()、相対カラー構文）、ダークモード、強制カラーモード、コントラスト

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `color-media` 第15章 色（約3,700字）https://t-arai-pnrm.github.io/css-coding-guideline/color-media/
- `color-media/color` 15-1 色の形式と色空間（約8,600字）https://t-arai-pnrm.github.io/css-coding-guideline/color-media/color/
- `color-media/relative-color` 15-2 相対カラー構文で派生色を作る（約1.5万字）https://t-arai-pnrm.github.io/css-coding-guideline/color-media/relative-color/
- `color-media/contrast-text` 15-3 背景から文字色を決める（約2万字）https://t-arai-pnrm.github.io/css-coding-guideline/color-media/contrast-text/
- `color-media/dark-mode` 15-4 ダークモード（約1.7万字）https://t-arai-pnrm.github.io/css-coding-guideline/color-media/dark-mode/
- `color-media/forced-colors` 15-5 強制カラーモードとコントラスト（約2.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/color-media/forced-colors/

## 15-1 色の形式と色空間

https://t-arai-pnrm.github.io/css-coding-guideline/color-media/color/

- 【推奨・実装上の判断】色のトークンと色の値は、`oklch()` で定義する。（`oklch-for-colors`）
  - 理由: 明度・彩度・色相が値から読み取れ、色相が違っても明度をそろえれば同じくらいの明るさに見えるため。
  - 補足: 16進数や `hsl()` の明度は、見た目の明るさと一致しません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/color/#rule-oklch-for-colors
- 【推奨・実装上の判断】彩度の高い2色以上をつなぐグラデーションには、`linear-gradient(in oklch, …)` のように補間の色空間を書く。（`gradient-interpolation-space`）
  - 理由: 既定の補間の色空間は色の書き方で変わり（旧来の書き方の色だけなら sRGB で、中間の色が灰色にくすむ。それ以外は Oklab）、色空間を書けば意図した補間がコードから分かるため。
  - 補足: `oklch` の色相は `shorter hue` の経路で補間されます。長いほうを通すときは `in oklch longer hue` と書きます。対応していない環境ではこの宣言が無視されるので、`background-color` も書いておきます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/color/#rule-gradient-interpolation-space

## 15-2 相対カラー構文で派生色を作る

https://t-arai-pnrm.github.io/css-coding-guideline/color-media/relative-color/

- 【推奨・実装上の判断】透過させた色や明度を変えた色は元の色から作り、そのためのトークンや RGB の値を別に用意しない。（`derive-colors-from-base`）
  - 理由: 元の色を1か所直すだけで派生させた色も追従し、元の色との関係がコードに残るため。
  - 補足: `--color-primary-rgb: 228 161 83` のような、`rgb()` で不透明度を付けるためだけのトークンは作りません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/relative-color/#rule-derive-colors-from-base
- 【推奨・実装上の判断】1つの色の不透明度や明度だけを変えるときは、`oklch(from var(--color) l c h / 10%)` のような相対カラー構文で書く。（`relative-color-for-single-color`）
  - 理由: 変えたい成分だけを書き換え、ほかの成分は元の色のまま保てるため。
  - 補足: 相対カラー構文の `l` は 0 から 1 の数値なので、計算するときは `calc(l - 0.15)` のように数値で書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/relative-color/#rule-relative-color-for-single-color
- 【推奨・実装上の判断】2つの色の間の色は `color-mix()` で作り、補間の色空間には `oklab` を指定する。（`color-mix-for-two-colors`）
  - 理由: 背景色と文字色の中間のように、2つの色の関係で決まる色を、両方の色の変化に追従させられるため。
  - 補足: `currentColor` に不透明度を付けるときは、`color-mix(in oklab, currentColor 60%, transparent)` のように透明と混ぜます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/relative-color/#rule-color-mix-for-two-colors
- 【推奨・実装上の判断】種類ごとに色が変わるコンポーネントは、元の色1つを内部プロパティで差し替え、枠線は `currentColor`、背景は元の色と `contrast-color()` で作った対比色を `color-mix()` で混ぜて作る。（`variant-palette-from-one-color`）
  - 理由: 種類を足すときに書くのが色1つで済み、枠線や背景の色を種類ごとに持たずに済むため。
  - 補足: 種類は `data-variant` 属性で、種類にない色は公開プロパティ（`--toast--foreground`）で渡します。文字色と背景の組み合わせごとにコントラスト比を確かめます。Safari 18系に対応するときは、対比色を `sign()` で作ります（ルール `prefer-contrast-color`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/relative-color/#rule-variant-palette-from-one-color

## 15-3 背景から文字色を決める

https://t-arai-pnrm.github.io/css-coding-guideline/color-media/contrast-text/

- 【推奨・実装上の判断】背景色から文字色を黒か白に決めるときは、対象の環境が Safari 26 以上なら `contrast-color()` で書く。Safari 18系に対応するときや、切り替える明度や色を自分で決めたいときは、相対カラー構文と `sign()` で書く。（`prefer-contrast-color`）
  - 理由: `contrast-color(var(--_background))` と書けば、背景色を変えても文字色を見直さずに済み、式を読み解く必要もないため。`contrast-color()` に未対応の環境（Safari 26 より前）では `color` の宣言が無効になり、継承した文字色が背景に溶け込むので、その環境に対応するときは `sign()` で書く。
  - 補足: ブラウザは WCAG 2.x のコントラスト比で黒か白を選ぶので、中間の明度の色では APCA の評価と逆になることがあります（明度0.57の青では黒が選ばれますが、APCA では白のほうが適切です）。選ばれた色は実際の表示で確かめます。色味を加えるときは `color-mix(in oklab, contrast-color(var(--_background)) 85%, var(--_background))` のように混ぜます。`sign()` で書くときは `oklch(from var(--_background) sign(0.7 - l) 0 h)` とし、閾値の0.7は APCA で白と黒の評価が入れ替わる明度（約0.72）に近い値です。どちらの書き方でも、使う背景色はコントラスト比を確認済みの候補に限ります。画像が表示されなかった場合の背景色は、`contrast-color-for-image-fallback` を参照してください。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/contrast-text/#rule-prefer-contrast-color
- 【推奨・仕様上の制約】画像の上に文字を載せる部品で、画像が表示されなかった場合に備える背景色は、文字色から決める。`background-color: oklch(from currentColor sign(0.7 - l) 0 h)` を先に書き、続けて `background-color: contrast-color(currentColor)` で上書きする。（`contrast-color-for-image-fallback`）
  - 理由: 文字色と対比する白か黒が背景色になり、文字色を変えても背景色を書き直さずに済むため。`contrast-color(currentColor)` だけでは、未対応の環境（Safari 26 より前）で背景色が付かず、画像が表示されないときに白い文字が明るいページの背景に溶け込むため。
  - 補足: 画像の上の文字には白や黒に近い色を選ぶので、WCAG 2.x と APCA で判定が分かれる中間の明度の色は、ふつう渡されません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/contrast-text/#rule-contrast-color-for-image-fallback

## 15-4 ダークモード

https://t-arai-pnrm.github.io/css-coding-guideline/color-media/dark-mode/

- 【推奨・実装上の判断】ダークモードの色はセマンティクスのトークンに `light-dark()` で持たせ、コンポーネントに `prefers-color-scheme` のメディアクエリを書かない。（`light-dark-in-semantic-tokens`）
  - 理由: 配色の切り替えがトークンの定義にまとまり、ダーク用の値の書き忘れや、色の散らばりを防げるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/dark-mode/#rule-light-dark-in-semantic-tokens
- 【必須・仕様上の制約】`light-dark()` を使うページでは、`<meta name="color-scheme" content="light dark">` で両方の配色に対応していることを宣言する。（`color-scheme-meta-for-light-dark`）
  - 理由: 宣言がないと、OS がダークモードでも `light-dark()` は常にライトの値になり、ブラウザの部品の配色も切り替わらないため。
  - 補足: ダークモードに対応しないサイトでは、この宣言を書きません（第8章の `no-color-scheme-without-dark-mode`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/dark-mode/#rule-color-scheme-meta-for-light-dark
- 【必須・仕様上の制約】コンポーネントに `color-scheme` を指定するときは、同じ要素で `color` と `background-color` をセマンティクスのトークンで指定し直す。（`redeclare-colors-with-color-scheme`）
  - 理由: 継承した `color` は親の配色で計算済みの色なので切り替わらず、背景を指定しないと親の背景が透けて見えるため。
  - 補足: トークンを `@property` で `<color>` 型として登録すると、`:root` の配色で色が決まり、コンポーネントの `color-scheme` に追従しません（第10章の `at-property-only-when-needed`）。`::placeholder` や `::selection` の色も、`light-dark()` を含むトークンで指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/dark-mode/#rule-redeclare-colors-with-color-scheme
- 【推奨・実装上の判断】テーマを手動で切り替えるときは、`<meta name="color-scheme">` の `content` を `light only`、`dark only`、`light dark` のいずれかに書き換える。（`theme-switch-via-meta`）
  - 理由: 色の切り替えをすべて `light-dark()` に任せられ、切り替えの仕組みが1か所にまとまるため。
  - 補足: 選んだ値は localStorage に保存し、`<head>` の中のスクリプトで描画の前に読み戻します。localStorage へのアクセスは `try` で囲みます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/dark-mode/#rule-theme-switch-via-meta

## 15-5 強制カラーモードとコントラスト

https://t-arai-pnrm.github.io/css-coding-guideline/color-media/forced-colors/

- 【推奨・仕様上の制約】強制カラーモードに合わせて色を指定し直すときは、`CanvasText`、`LinkText`、`ButtonText`、`GrayText` などのシステムカラーを使う。（`forced-colors-system-colors`）
  - 理由: ユーザーが選んだ配色に合わせた色になり、背景とのコントラストが保たれるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/forced-colors/#rule-forced-colors-system-colors
- 【必須・仕様上の制約】枠線を消すときは、`border: none` ではなく `border-color: transparent` で透明にする。（`transparent-border-over-none`）
  - 理由: 強制カラーモードでは透明な枠線にも色が付くので、背景色が消えても、ボタンなどの範囲が分かるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/forced-colors/#rule-transparent-border-over-none
- 【推奨・仕様上の制約】フォーカスリングを `box-shadow` などで描き直すときは、`outline` を消さずに `outline-color: transparent` で透明にして残す。（`transparent-outline-for-custom-focus`）
  - 理由: 通常の表示では独自の表現だけが見え、強制カラーモードでは `outline` がシステムカラーに置き換わって、キーボードで操作している位置が見えるため。
  - 補足: `outline: none` や `outline: 0` で消さない理由は、第8章の `no-outline-none` を参照してください。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/forced-colors/#rule-transparent-outline-for-custom-focus
- 【禁止・仕様上の制約】要素の境界や区切りを、`box-shadow` だけで描かない。（`no-box-shadow-only-boundary`）
  - 理由: 強制カラーモードでは `box-shadow` が `none` になり、境界が消えるため。
  - 補足: フォーカスリングについては、第8章の `focus-ring-not-box-shadow-only` を参照してください。区切り線や枠線を `box-shadow` で描くときは、`@media (forced-colors: active)` の中で同じ太さの `outline` を描きます（16-7）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/forced-colors/#rule-no-box-shadow-only-boundary
- 【必須・仕様上の制約】`mask-image` や `clip-path` で切り抜き、`background-color` で塗る図形は、`currentColor` を直接指定せず、強制カラーモードでシステムカラーに切り替わるカスタムプロパティ（`--background-current`）から色を受け取る。（`background-current-for-shapes`）
  - 理由: 強制カラーモードでは `background-color` がページの背景色に置き換わり、図形が見えなくなるため。
  - 補足: 通常の文字の文脈でしか使わない図形は、`background-image` に `conic-gradient(currentColor 0 0)` を、`background-color` に `CanvasText` を指定する方法でも描けます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/forced-colors/#rule-background-current-for-shapes
- 【推奨・仕様上の制約】強制カラーモードでは、管理している単色のインライン SVG アイコンの色を、塗りで描くものは `fill`、線で描くものは `stroke` だけ、文脈に合ったシステムカラーに `!important` で固定する。（`forced-colors-svg-system-colors`）
  - 理由: SVG の色は強制カラーモードでも置き換わるとは限らず、`currentColor` がシステムカラーにならない環境もあるため。すべての SVG に両方を指定すると、線のない図形に線が付くため。
  - 補足: 多色の SVG は対象にしません。値が `none` の描画要素は、そのままにします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/forced-colors/#rule-forced-colors-svg-system-colors
- 【推奨・仕様上の制約】単色のアイコンを `<img>` で表示するときは、強制カラーモードで `filter` を使い、背景と反対の色に塗りつぶす。（`forced-colors-image-icon-filter`）
  - 理由: 画像は強制カラーモードの影響を受けないので、黒いアイコンは黒い背景に、白いアイコンは白い背景に溶け込むため。
  - 補足: `prefers-color-scheme` と組み合わせ、ライトでは `brightness(0)`、ダークでは `brightness(0) invert(1)` にします。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/forced-colors/#rule-forced-colors-image-icon-filter
- 【推奨・仕様上の制約】強制カラーモードで意味が変わる装飾（`outline` のオーバーレイ、スクロールバーの色など）は、`@media (forced-colors: none)` の中に書く。（`forced-colors-none-for-fragile-decoration`）
  - 理由: 強制カラーモードでは色がシステムカラーに置き換わり、装飾が内容を覆ったり、部品が見えなくなったりするため。
  - 補足: 条件は `not (forced-colors: active)` ではなく、`(forced-colors: none)` と書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/forced-colors/#rule-forced-colors-none-for-fragile-decoration
- 【必須・仕様上の制約】本文の中のリンク、フォーカスやホバーの状態、入力エラーのような情報を、色の違いだけで伝えない。（`no-color-only-information`）
  - 理由: 色の見え方は人によって違い、グレースケールで表示している人もいるため（WCAG 2.1 の「色の使用」）。
  - 補足: 下線、太さ、アイコン、文言のような、色以外の手がかりを足します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/forced-colors/#rule-no-color-only-information
- 【推奨・実装上の判断】実装を終えたら、グレースケールの表示で、リンクや状態を見分けられるかを確かめる。（`grayscale-check`）
  - 理由: 色だけに頼った表現は、カラーの画面では気づきにくいため。
  - 補足: 基本は OS のグレースケール表示を使い、手早く確かめるときは `body` に `filter: grayscale(1)` を一時的に指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/forced-colors/#rule-grayscale-check
- 【必須・仕様上の制約】文字と背景のコントラスト比は、WCAG 2.1 の AA（通常の文字で 4.5:1 以上、大きな文字で 3:1 以上）を満たす。（`text-contrast-aa`）
  - 理由: 視力の弱い人や、明るい屋外で画面を見る人にも文字を読めるようにするため。
  - 補足: 薄い文字色のトークンは、組み合わせる背景のトークンごとに確かめます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/color-media/forced-colors/#rule-text-contrast-aa
