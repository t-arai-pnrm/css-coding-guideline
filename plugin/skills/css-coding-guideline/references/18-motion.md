# 第18章 モーション：ルール

- ガイドラインのバージョン: 0.47.2（2026-10-10 生成）
- ルールの数: 31
- 本文: 約16.1万字
- 読む条件: transition、animation、@keyframes、prefers-reduced-motion、スクロール連動、View Transitions

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `motion` 第18章 モーション（約4,700字）https://t-arai-pnrm.github.io/css-coding-guideline/motion/
- `motion/purpose` 18-1 動かすかどうかを決める（約8,800字）https://t-arai-pnrm.github.io/css-coding-guideline/motion/purpose/
- `motion/reduced-motion` 18-2 動きを減らす設定に対応する（約1.4万字）https://t-arai-pnrm.github.io/css-coding-guideline/motion/reduced-motion/
- `motion/easing-and-duration` 18-3 イージングと再生時間（約2.3万字）https://t-arai-pnrm.github.io/css-coding-guideline/motion/easing-and-duration/
- `motion/transitions-and-keyframes` 18-4 トランジションと@keyframes（約2.1万字）https://t-arai-pnrm.github.io/css-coding-guideline/motion/transitions-and-keyframes/
- `motion/entry-and-exit` 18-5 出現と退場（約2.6万字）https://t-arai-pnrm.github.io/css-coding-guideline/motion/entry-and-exit/
- `motion/scroll-driven` 18-6 スクロールに合わせて動かす（約3.2万字）https://t-arai-pnrm.github.io/css-coding-guideline/motion/scroll-driven/
- `motion/performance` 18-7 動きの負荷を抑える（約1.9万字）https://t-arai-pnrm.github.io/css-coding-guideline/motion/performance/
- `motion/view-transitions` 18-8 View Transitionsで画面の切り替えをつなぐ（約1.2万字）https://t-arai-pnrm.github.io/css-coding-guideline/motion/view-transitions/

## 18-1 動かすかどうかを決める

https://t-arai-pnrm.github.io/css-coding-guideline/motion/purpose/

- 【推奨・実装上の判断】アニメーションを足す前に、状態の変化や操作の結果を伝えるという目的があるかを確かめ、目的のない動きは入れない。（`motion-needs-purpose`）
  - 理由: 何度も触る UI の装飾的な動きは、待ち時間と操作の負担を増やすだけになるため。
  - 補足: その動きを見る頻度でも判断を変えます。1日に何十回も使う操作（メニュー、タブ、ツールバー）は動かさないか、押したときの縮小のような最小限の動きにとどめます。ブランドの個性を表す動きは、LP のヒーローや初回の案内のように、まれにしか見ない UI に限ります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/purpose/#rule-motion-needs-purpose
- 【禁止・実装上の判断】キーボードショートカットで開閉する UI（コマンドパレットなど）に、出現と退場の動きを付けない。（`no-motion-on-keyboard-shortcut`）
  - 理由: キーを押す操作は素早く続けて行われることが多く、動きが終わるのを待つと、入力と表示がずれて反応が遅く感じられるため。
  - 補足: クリックとショートカットのどちらでも開く UI は、ショートカットで開いたときに JavaScript で属性を付け、その属性があるときは `transition-duration` を0にします。キーボードでのフォーカスの移動は `no-motion-on-focus-visible` で扱います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/purpose/#rule-no-motion-on-keyboard-shortcut
- 【推奨・実装上の判断】動きは CSS のトランジション、アニメーション、View Transitions、スクロール駆動アニメーションで作り、JavaScript のアニメーションライブラリは、CSS だけでは作れない動きにだけ使う。（`css-before-js-animation`）
  - 理由: 合成だけで動かせる CSS の動きはメインスレッドが忙しいときにも影響を受けにくいことが多く、ライブラリの読み込みと保守の負担も要らないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/purpose/#rule-css-before-js-animation

## 18-2 動きを減らす設定に対応する

https://t-arai-pnrm.github.io/css-coding-guideline/motion/reduced-motion/

- 【必須・仕様上の制約】装飾的な動きのうちフェード以外は `@media (prefers-reduced-motion: no-preference)` の中で指定する。（`motion-only-with-no-preference`）
  - 理由: WCAG 2.2 の達成基準2.3.3（レベル AAA）は、操作をきっかけに起きる本質的でない動きのアニメーションを無効にできることを求めており、装飾的な動きはなくても情報が欠けないため。設定がないときにだけ動きを付ければ、動きを減らす設定をしているユーザーに、めまいや吐き気の原因になる動きを見せずに済むため。
  - 補足: WCAG の「動きのアニメーション」には、要素の大きさ、形、位置が変わって見えない色や不透明度の変化は含まれないので、位置と大きさの変わらないフェードは条件の外に書いてかまいません。全称セレクタと `!important` で全体の動きを止める書き方には頼りません。機能的な動きの扱いは `simplify-large-motion-when-reduced` で定めます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/reduced-motion/#rule-motion-only-with-no-preference
- 【必須・実装上の判断】機能的な動きでも大きな変動は、動きを減らす設定のときにフェードへ置き換える。（`simplify-large-motion-when-reduced`）
  - 理由: 状態の変化や操作の結果を伝える動きでも、多くは WCAG 2.3.3 の「本質的な動き」（その動きがないと機能や情報が成り立たないもの）にあたらず、フェードでも同じ情報を伝えられるため。フェードは位置と大きさが変わらないので、WCAG 2.3.3 の「動きのアニメーション」を無効にしたことになる。
  - 補足: 大きな変動は、本書の目安では、画面の3分の1以上を占める要素の移動、回転を伴う動き、`scale` の変化量が0.5以上の拡大や縮小、スクロールに合わせた変形、揺れる動きです。WCAG が定める基準ではなく、目安を下回れば配慮が要らないという意味でもありません。再生時間を短くする対応（本書の目安は50ms以下）は、位置と大きさが変わらない動き（フェード）に限ります。AAA を目標にしないサイトで、移動や拡大を短くして残す場合は、動きが残るので WCAG 2.3.3 を満たしません。AAA に適合させるなら、本質的でない移動や拡大は、大きさを問わず無効にするか、フェードへ置き換えます。スピナー、プログレスバー、フォーカスリングの表示は変えません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/reduced-motion/#rule-simplify-large-motion-when-reduced

## 18-3 イージングと再生時間

https://t-arai-pnrm.github.io/css-coding-guideline/motion/easing-and-duration/

- 【必須・実装上の判断】拡大して現れる動きは `scale: 0` から始めず、ツールチップとポップオーバーは0.95〜0.98、ドロップダウンメニューは0.92〜0.96、ダイアログやドロワーは0.85〜0.92から始め、`transform-origin` をトリガーのある側に向ける。（`scale-in-from-near-one`）
  - 理由: 何もないところから膨らむ動きは物理的に不自然で、起点が中央のままだと、どこから現れたのかが伝わらないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/easing-and-duration/#rule-scale-in-from-near-one
- 【非推奨・実装上の判断】UI の出現、退場、移動に、`ease-in` や `in` 系のイージング（だんだん速くなる動き）を使わない。（`no-ease-in-for-ui`）
  - 理由: 動き始めの変化が小さいので操作してから反応が見えるまでが遅れて感じられ、最も速い状態のまま急に止まるので物理的にも不自然に見えるため。
  - 補足: 現れる動きと消える動きには `out` 系、画面の上にあるものの移動には `in-out` 系のトークンを使います。本書のイージングのトークンには、`in` 系を用意していません。加速していく様子そのものを見せたい演出のように、理由がある場合は使ってかまいません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/easing-and-duration/#rule-no-ease-in-for-ui
- 【推奨・実装上の判断】`linear` のイージングは、マーキーやプログレスバーのように一定の速さで続く動きにだけ使い、UI の状態の変化には使わない。（`linear-only-for-constant-motion`）
  - 理由: 速さが変わらない動きは機械的に見え、始まりと終わりが唐突に感じられるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/easing-and-duration/#rule-linear-only-for-constant-motion
- 【必須・実装上の判断】操作に応じる機能的な動きの再生時間は300ms以下にし、ダイアログ、ドロワー、シートのように画面の大部分を覆う UI でも500ms以下にする。（`functional-motion-under-300ms`）
  - 理由: 動きが終わるまで次の操作を待たせず、1日に何度も触る UI でも待ち時間が積み重ならないようにするため。
  - 補足: 例外は、スクロールで画面に入ったときに一度だけ再生する演出の `--duration--reveal`（600ms）と、ばねの動きの `--duration--spring`（700ms）だけです。どちらも頻繁に触る UI には使いません。ツールチップの表示を遅らせる `transition-delay` は、再生時間に含めません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/easing-and-duration/#rule-functional-motion-under-300ms
- 【推奨・実装上の判断】ボタンを押したことを動きで返すときは、`:active` で `scale` を0.96〜0.98に縮め、再生時間を100〜150msにする。（`press-feedback-short`）
  - 理由: 押したことがすぐに伝わり、短い動きなら続けて押す操作の妨げにならないため。
  - 補足: 押したことを伝える必要がある UI にだけ使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/easing-and-duration/#rule-press-feedback-short
- 【推奨・実装上の判断】ばねやバウンスの動きは、`linear()` をジェネレーターで作り、再生時間とセットでトークンにして、コンポーネントに値を直接書かない。（`spring-easing-token`）
  - 理由: 点の数が多く手で保守できず、トークンにすれば、揺れが収まるまでの時間とイージングを対で使い回せるため。
  - 補足: 揺れが収まるまでの時間が要るので、機能的な動きの上限（300ms）を超えます。頻繁に触る UI には使わず、`prefers-reduced-motion: no-preference` の中でだけ指定します。`opacity` には使いません。0〜1の範囲を超えた値が丸められ、揺れが明滅になるためです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/easing-and-duration/#rule-spring-easing-token

## 18-4 トランジションと@keyframes

https://t-arai-pnrm.github.io/css-coding-guideline/motion/transitions-and-keyframes/

- 【禁止・実装上の判断】`transition: all` や `transition-property: all` を使わない。（`no-transition-all`）
  - 理由: 関係のないプロパティまで動き、意図しないアニメーションや無駄な描画の負荷を生むため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/transitions-and-keyframes/#rule-no-transition-all
- 【推奨・本書の規約】トランジションは `transition-duration`、`transition-property`、`transition-timing-function` のロングハンドで書き、再生時間とイージングにはトークンを使う。（`transition-longhand-with-tokens`）
  - 理由: 動かすプロパティが一目で分かり、サイトの中で動きの速さと質感がそろうため。
  - 補足: `transition-behavior: allow-discrete` も、略記の `transition` に含めず、ロングハンドで書きます。略記に入れると、`allow-discrete` を解釈できないブラウザでは宣言全体が無効になり、ほかのプロパティのトランジションまで失われるためです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/transitions-and-keyframes/#rule-transition-longhand-with-tokens
- 【推奨・仕様上の制約】状態に入るときと外れるときで再生時間を変えるなら、基本のルールに長い再生時間を、入る側の状態のルールに短い再生時間を書く。入る側の再生時間も `prefers-reduced-motion: no-preference` の中に書く。（`transition-duration-per-direction`）
  - 理由: 反応の速さと、戻るときの自然さを両立できるため。`transition-property` の初期値は `all` なので、条件の外に書くと、動きを減らす設定でもすべてのプロパティが動くため。
  - 補足: どちらの再生時間もトークンから選びます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/transitions-and-keyframes/#rule-transition-duration-per-direction
- 【推奨・仕様上の制約】操作の途中で取り消されることがある動きは `@keyframes` ではなくトランジションで書き、タブやセグメンテッドコントロールのように続けて押される UI では、再生時間を100〜150msにするか、動きを省く。（`interruptible-with-transition`）
  - 理由: トランジションは途中の状態から逆向きに戻るが、`@keyframes` のアニメーションは途中で止めると値が飛び、続けて押すと動きが操作に追いつかないため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/transitions-and-keyframes/#rule-interruptible-with-transition
- 【推奨・仕様上の制約】アニメーションは `animation` の略記ではなく、`animation-name` などのロングハンドで書き、`animation-fill-mode` は `both` を第一候補にする。（`animation-longhand-fill-mode`）
  - 理由: 略記は `animation-timeline` と `animation-range` もリセットするため。また、`both` にしないと、遅延の間は開始前の見た目のままで、終わった瞬間にもとの値へ戻り、見た目が飛ぶため。
  - 補足: `transition-longhand-with-tokens` と対になるルールです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/transitions-and-keyframes/#rule-animation-longhand-fill-mode
- 【推奨・本書の規約】グローバルな `@keyframes` は1つにつき1つのプロパティだけを変え、複数の動きは `animation-name` のカンマ区切りで組み合わせる。（`keyframes-single-property`）
  - 理由: プロパティごとに再生時間とイージングを選び分けられ、単体でも再利用できるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/transitions-and-keyframes/#rule-keyframes-single-property
- 【推奨・実装上の判断】`@keyframes` の自明な `from` や `to` は省略し、要素がもともと持っている値に向けて（または、その値から）動かす。（`keyframes-omit-obvious-frame`）
  - 理由: 値を書き込むと、要素の実際の値と食い違ったときに、動きの始めや終わりで値が飛ぶため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/transitions-and-keyframes/#rule-keyframes-omit-obvious-frame
- 【推奨・本書の規約】動きの起点や方向を変えたいときは、`@keyframes` の中で `--<keyframes の名前>--<値の名前>` のカスタムプロパティを参照し、使う側から値を渡す。（`keyframes-api-properties`）
  - 理由: 同じ `@keyframes` を、起点や方向だけを変えて使い回せるため。
  - 補足: 例：`--translate-from` の中で `var(--translate-from--y-value, 0)` を参照し、使う側で `--translate-from--y-value: 24px` を指定します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/transitions-and-keyframes/#rule-keyframes-api-properties
- 【推奨・本書の規約】中間のフレームを持つものや、複数のプロパティを同時に動かす `@keyframes` は、コンポーネントの CSS に `--<コンポーネント>--<動きの名前>` の名前で定義する。（`keyframes-local-naming`）
  - 理由: 特定の UI に結びついた動きをグローバルに置かず、名前の衝突も防げるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/transitions-and-keyframes/#rule-keyframes-local-naming

## 18-5 出現と退場

https://t-arai-pnrm.github.io/css-coding-guideline/motion/entry-and-exit/

- 【推奨・実装上の判断】`display: none` から表示する要素の出現と退場は、`@starting-style` と `transition-behavior: allow-discrete` で動かす。（`starting-style-for-entry`）
  - 理由: JavaScript でクラスを付け外しするタイミングを調整しなくても、CSS だけで出現と退場の両方を動かせるため。
  - 補足: `@starting-style` は、開いた状態のセレクタの中に書きます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/entry-and-exit/#rule-starting-style-for-entry
- 【推奨・仕様上の制約】`@starting-style` で動かすプロパティは、詳細度の高い規則やインラインスタイルで指定しない。`@starting-style` は元の規則の中に書く。出現だけを動かすなら `@keyframes` の `from` を使う。（`starting-style-not-overridden`）
  - 理由: `@starting-style` の宣言は通常のカスケードで競い合い、より強い指定があると開始値にならず、トランジションが起きないため。
  - 補足: `!important` や詳細度を上げるセレクタで解決しようとしません。ほかの状態のスタイルまで上書きしてしまうためです。`@keyframes` の値は通常の宣言より優先されます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/entry-and-exit/#rule-starting-style-not-overridden

## 18-6 スクロールに合わせて動かす

https://t-arai-pnrm.github.io/css-coding-guideline/motion/scroll-driven/

- 【推奨・実装上の判断】スクロール位置に合わせて連続して変わる動きはスクロール駆動アニメーションで、画面に入ったときに1回だけ動かす演出は `view()` のタイムラインで切り替えたカスタムプロパティを `@container style()` で問い合わせて作り、`scroll` イベントで毎回位置を計算しない。（`scroll-linked-method`）
  - 理由: スクロールのたびに位置を計算する処理はメインスレッドを占有し、動きがかくつく原因になるため。
  - 補足: Firefox でも演出を出したい場合と、スクロールを戻しても再生を途中で止めたくない場合は、`IntersectionObserver` で属性を切り替えます。1回だけ動かす演出を CSS だけで書く `timeline-trigger` と `animation-trigger` は、2026年10月の時点で Chrome 系のブラウザだけが対応しています。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/scroll-driven/#rule-scroll-linked-method
- 【推奨・実装上の判断】画面に入ったら1回だけ再生する演出は、ルートの `view()` のタイムラインで登録していないカスタムプロパティを `--false` から `--true` に切り替え、子の一時停止したアニメーションを `@container style(--_in-view: --true)` の中で `running` にし、全体を `@supports (animation-timeline: view()) and (animation-range: entry)` で囲む。（`reveal-once-with-style-query`）
  - 理由: 見た目の変化を時間で進むアニメーションで再生するので、スクロールを止めた位置で途中のまま残らず、スクロール駆動アニメーションに対応していない環境では演出なしで内容を表示できるため。
  - 補足: 登録していないカスタムプロパティは、キーフレームの50%の時点で切り替わるので、`animation-timing-function: linear` なら範囲の中間（`entry 0% entry 60%` なら `entry 30%`）で再生が始まります。範囲を過ぎても値を残すために `animation-fill-mode: both` を指定します。スタイルクエリは自分の値を問い合わせられないので、切り替える要素と再生する要素を分けます。範囲より手前まで戻すと一時停止し、再生の途中なら、その位置で止まります。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/scroll-driven/#rule-reveal-once-with-style-query
- 【推奨・実装上の判断】スクロール駆動アニメーションは、`animation-range` で範囲を明示する。（`scroll-animation-explicit-range`）
  - 理由: 指定しないと `view()` では `cover`（画面に入り始めてから出終わるまで）の全体になり、見せたいタイミングとずれやすいため。
  - 補足: `entry`、`exit`、`contain` で範囲を絞るときは、範囲の前後の見た目のために `animation-fill-mode: both` も指定します。対応を確かめる `@supports` は、`(animation-timeline: view()) and (animation-range: entry)` のように `animation-range` も条件に加えます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/scroll-driven/#rule-scroll-animation-explicit-range
- 【推奨・実装上の判断】JavaScript で動かす演出の準備のスタイルは、JavaScript が準備（監視の開始やライブラリの読み込み）を終えてルートに `data-motion-mode="motion"` を付けたときだけ当て、基本のスタイルは動かないときの最終状態として書く。（`motion-mode-attribute`）
  - 理由: JavaScript が動かない環境や、動きを減らす設定をしている環境でも、すべての内容を読めるようにするため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/scroll-driven/#rule-motion-mode-attribute

## 18-7 動きの負荷を抑える

https://t-arai-pnrm.github.io/css-coding-guideline/motion/performance/

- 【推奨・実装上の判断】動かすプロパティは `opacity`、`translate`、`scale`、`rotate` を優先し、`inline-size` や `inset` のようにレイアウトが変わるプロパティは避ける。（`animate-composite-properties`）
  - 理由: レイアウトと描画をやり直さずに済み、動きが滑らかになるため。
  - 補足: 一部の `filter` も、ブラウザによっては合成だけで処理されます。`clip-path` はペイントが起きるものとして扱います。アコーディオンの高さのように、ほかに方法のない場合は例外です。`will-change` は CSS に書いたままにしません（`will-change-temporarily`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/performance/#rule-animate-composite-properties
- 【必須・実装上の判断】`will-change` は CSS に書いたままにせず、どうしても必要なときだけ、動きの直前に JavaScript で付けて、終わったら外す。（`will-change-temporarily`）
  - 理由: 指定し続けると合成レイヤーが作られたままになり、GPU のメモリを無駄に使うため。
  - 補足: 外す処理は `transitionend` だけでなく `transitioncancel` にも登録します。動きを減らす設定などでトランジションが起きないときは付けません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/performance/#rule-will-change-temporarily
- 【推奨・仕様上の制約】`content-visibility: auto` は最初の画面より下にある大きなブロックにだけ指定し、`contain-intrinsic-block-size: auto <長さ>` を組で書く。（`content-visibility-with-intrinsic-size`）
  - 理由: 描画を省いている間は中身の大きさが0として扱われるので、見積もりの大きさがないとスクロールバーの長さとスクロールの位置が飛ぶため。`auto` を付けると、一度描画したあとは実際の大きさを覚えて使うため。
  - 補足: 物理の `contain-intrinsic-size` や `contain-intrinsic-height` ではなく、論理の `contain-intrinsic-block-size` を使います。ページ内検索、Tab キーでの移動、スクリーンリーダーの読み上げで中身に届くかを確かめます。閉じたパネルのように、見つかるまで隠しておく中身には `hidden="until-found"` を使います。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/performance/#rule-content-visibility-with-intrinsic-size

## 18-8 View Transitionsで画面の切り替えをつなぐ

https://t-arai-pnrm.github.io/css-coding-guideline/motion/view-transitions/

- 【禁止・仕様上の制約】同時に表示される複数の要素に、同じ `view-transition-name` を付けない。（`view-transition-name-unique`）
  - 理由: 名前が重複すると撮影に失敗し、ほかの要素やページ全体の動きも含めて、切り替え全体のアニメーションが行われなくなるため。
  - 補足: 固定の名前は、ページに1つしかない要素にだけ付けます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/view-transitions/#rule-view-transition-name-unique
- 【推奨・実装上の判断】同じページの中の切り替えで、並んだ要素を1つずつ動かすときは、連番の名前を振らず、`view-transition-name: match-element` と `view-transition-class` を組み合わせる。（`view-transition-match-element`）
  - 理由: 名前の管理をブラウザに任せられ、動きの指定も `::view-transition-group(.<クラス>)` の1か所にまとめられるため。
  - 補足: `match-element` はページ間の遷移では使えないので、ページ間でつなぐ要素には、前後のページで同じ名前を明示的に付けます。`view-transition-class` だけでは要素は個別に撮影されません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/motion/view-transitions/#rule-view-transition-match-element
