# 第19章 実務での運用：ルール

- ガイドラインのバージョン: 0.49.1（2026-10-10 生成）
- ルールの数: 27
- 本文: 約6万字
- 読む条件: Stylelint、レビュー、CMSの本文エリアやWYSIWYG、既存のサイトへの導入

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `operations` 第19章 実務での運用（約3,400字）https://t-arai-pnrm.github.io/css-coding-guideline/operations/
- `operations/stylelint` 19-1 Stylelintでルールを守る（約1.5万字）https://t-arai-pnrm.github.io/css-coding-guideline/operations/stylelint/
- `operations/review` 19-2 レビューの進め方（約4,700字）https://t-arai-pnrm.github.io/css-coding-guideline/operations/review/
- `operations/verification` 19-3 表示と操作を確かめる（約8,700字）https://t-arai-pnrm.github.io/css-coding-guideline/operations/verification/
- `operations/devtools` 19-4 表示の崩れを開発者ツールで調べる（約9,200字）https://t-arai-pnrm.github.io/css-coding-guideline/operations/devtools/
- `operations/wysiwyg` 19-5 CMSのWYSIWYG本文にスタイルを当てる（約8,500字）https://t-arai-pnrm.github.io/css-coding-guideline/operations/wysiwyg/
- `operations/adoption` 19-6 既存のサイトに段階的に導入する（約1万字）https://t-arai-pnrm.github.io/css-coding-guideline/operations/adoption/

## 19-1 Stylelintでルールを守る

https://t-arai-pnrm.github.io/css-coding-guideline/operations/stylelint/

- 【必須・本書の規約】CSS を変更したら Stylelint を実行し、エラーを残さない。（`run-stylelint-before-done`）
  - 理由: 機械的に判断できる違反をレビューに持ち込まず、レビューを命名や設計の判断に集中させるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/stylelint/#rule-run-stylelint-before-done
- 【禁止・実装上の判断】エラーや警告を消すことだけを目的に、ルールを無効にしたり検査を飛ばしたりしない。（`no-disabling-to-silence`）
  - 理由: 違反がなくなるのではなく見えなくなるだけで、同じ誤りが残り続けるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/stylelint/#rule-no-disabling-to-silence
- 【必須・本書の規約】ルールを無効にするときは、`stylelint-disable-next-line` とルール名で1行・1つのルールに絞り、直前のコメントに理由を書く。（`disable-one-line-with-reason`）
  - 理由: 範囲を広げると、同じ場所にある別の誤りまで見逃すうえ、なぜ無効にしたのかが後から分からなくなるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/stylelint/#rule-disable-one-line-with-reason
- 【推奨・実装上の判断】プロパティの並び順のように自動で直せる違反は、手で直さず、`stylelint --fix` とエディタの保存時の自動修正に任せる。（`autofix-mechanical-issues`）
  - 理由: 整形はツールの仕事で、人が手作業でそろえると時間がかかるうえ、漏れが出るため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/stylelint/#rule-autofix-mechanical-issues
- 【推奨・本書の規約】禁止リストのルール（`unit-disallowed-list` など）には、`message` で代わりの書き方を示す。（`disallowed-list-with-message`）
  - 理由: 何を書けばよいかがその場で分かり、ルールを無効にして済ませる動機を減らせるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/stylelint/#rule-disallowed-list-with-message
- 【推奨・本書の規約】置き換え先を人が選ぶ必要のあるルールは警告に、正解が1つに決まるルールはエラーにする。（`warning-for-judgement-rules`）
  - 理由: 機械的に直せる違反は確実に止め、判断の要る違反は人に判断を促せるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/stylelint/#rule-warning-for-judgement-rules
- 【推奨・実装上の判断】警告は放置せず、直すか、意図して使う場合は理由を添えてルールを1行だけ無効にする。（`resolve-warnings`）
  - 理由: 警告を放置すると、本当に直すべき警告が一覧に埋もれ、誰も警告を読まなくなるため。
  - 補足: 警告だけでは Stylelint の終了コードは失敗になりません。CI で警告も失敗にするときは、`--max-warnings 0` を付けて実行します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/stylelint/#rule-resolve-warnings
- 【必須・実装上の判断】ガイドラインのルールを変えたら、Stylelint の設定も合わせて変え、本文と設定を食い違わせない。（`lint-config-matches-guideline`）
  - 理由: 設定がガイドラインの意図とずれると、ツールが誤りを直すどころか、誤りを強制するため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/stylelint/#rule-lint-config-matches-guideline
- 【推奨・実装上の判断】ガイドラインや設計のドキュメントに載せる推奨のコード例も、同じ Stylelint の設定で検証する。（`lint-documented-examples`）
  - 理由: コード例が自分のルールに違反していると、ドキュメントが信用されず、AI にもそのまま手本として真似されるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/stylelint/#rule-lint-documented-examples

## 19-2 レビューの進め方

https://t-arai-pnrm.github.io/css-coding-guideline/operations/review/

- 【必須・実装上の判断】レビューの指摘には、理由と解決策を必ずセットで書く。（`review-reason-and-solution`）
  - 理由: 何が問題で、どう直せばよいかが伝わらないと、書いた人が調べ直すことになり、同じ誤りを繰り返すため。
  - 補足: 本書のルールに当てはまる指摘には、ルールの ID を添えます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/review/#rule-review-reason-and-solution
- 【推奨・本書の規約】レビューの指摘には `MUST`、`IMO`、`Q` のラベルを付けて、深刻度を区別する。（`review-severity-labels`）
  - 理由: 直さなければならない指摘と、好みの提案と、質問が混ざらないようにするため。
  - 補足: `MUST` は、仕様や規約への違反、バグ、将来の深刻な問題、使いやすさやアクセシビリティの阻害です。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/review/#rule-review-severity-labels
- 【推奨・実装上の判断】挙動に問題がなく、合意のない好みが入る指摘は `IMO` にとどめ、修正を強制しない。（`review-preferences-as-imo`）
  - 理由: 教義的なレビューは、ユーザーやクライアントのメリットにならない修正を増やすため。
  - 補足: 規約として合意したルールへの違反は、`MUST` として指摘します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/review/#rule-review-preferences-as-imo
- 【推奨・実装上の判断】意図が読み取れない記述は、誤りと決めつけずに `Q` で質問する。（`review-ask-unclear-intent`）
  - 理由: 書いた人にしか分からない事情がある場合があり、理由が分かればコメントとして残せるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/review/#rule-review-ask-unclear-intent
- 【推奨・本書の規約】レビューは、規約、トークン、ブラウザ対応、不要な記述、グローバルの CSS、内容の変化への耐性、コンポーネントの境界、レスポンシブ、コメントの順に確認する。（`review-check-order`）
  - 理由: 影響の大きい問題から確かめ、細部の指摘に埋もれて重大な問題を見逃すのを防ぐため。
  - 補足: インデントや並び順のような整形は、ツールが機能していないときだけ指摘します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/review/#rule-review-check-order
- 【推奨・本書の規約】レビューのコメントと AI への指示では、ルールを ID で引用する（例：`no-vw-vh`）。（`cite-rule-ids`）
  - 理由: ID は章の構成が変わっても変わらず、どのルールのことかが正確に伝わるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/review/#rule-cite-rule-ids

## 19-3 表示と操作を確かめる

https://t-arai-pnrm.github.io/css-coding-guideline/operations/verification/

- 【推奨・実装上の判断】実装後は、長い見出し、折り返せない文字列、読み込めない画像、0件・1件・多数の項目を入れたテストページで表示を確かめる。（`verify-worst-case-content`）
  - 理由: デザインカンプのダミーテキストは崩れる条件をほとんど含まず、実際の内容で初めてはみ出しや重なりが見つかるため。
  - 補足: 幅は320px、480px、768px、1024px、1280pxで確かめ、その後に間の幅も連続して変えて見ます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/verification/#rule-verify-worst-case-content
- 【必須・仕様上の制約】ブラウザのズームと文字サイズの設定をそれぞれ200%にしても、内容が欠けず、操作できることを確かめる。（`verify-text-resize-200`）
  - 理由: WCAGの達成基準1.4.4が、支援技術なしで文字を200%まで拡大しても内容や機能が失われないことを求めているため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/verification/#rule-verify-text-resize-200
- 【推奨・実装上の判断】キーボードだけで操作し、強制カラーモード、動きを減らす設定、グレースケールの表示を再現して確かめる。（`verify-keyboard-and-display-settings`）
  - 理由: フォーカスの見え方と移動の順番、色に頼った表現、止まらない動きは、コードを読むだけでは見落としやすく、条件を再現すると見つかるため。
  - 補足: 強制カラーモードと動きを減らす設定は、Chromeの開発者ツールの「Rendering」パネルで再現できます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/verification/#rule-verify-keyboard-and-display-settings

## 19-4 表示の崩れを開発者ツールで調べる

https://t-arai-pnrm.github.io/css-coding-guideline/operations/devtools/

- 【推奨・実装上の判断】宣言が効かないときは、詳細度を上げたり `!important` を付けたりする前に、開発者ツールで勝っている宣言と、差が付いた段階（レイヤー、詳細度、スコープの近さ、出現順）を確かめる。（`devtools-find-winning-declaration`）
  - 理由: 負けた理由を確かめずに順位を引き上げると、レイヤーの順番の誤りなどの原因が残り、上書きが積み重なるため。
  - 補足: 取り消し線のない宣言が効かないときは、条件を満たさない宣言か、未定義のカスタムプロパティの参照（計算値の時点で無効）を疑う。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/devtools/#rule-devtools-find-winning-declaration
- 【推奨・実装上の判断】崩れを直すときは、開発者ツールで値を一時的に書き換えて原因の宣言を1つに絞り、その宣言をソースのCSSで直す。（`devtools-narrow-cause-then-fix-source`）
  - 理由: 原因を絞らずに直すと、症状を消すだけの宣言が増え、開発者ツールでの変更は再読み込みで消えるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/devtools/#rule-devtools-narrow-cause-then-fix-source

## 19-5 CMSのWYSIWYG本文にスタイルを当てる

https://t-arai-pnrm.github.io/css-coding-guideline/operations/wysiwyg/

- 【推奨・実装上の判断】CMS の WYSIWYG が出力する本文エリアには `wysiwyg` クラスを付け、`@scope (.wysiwyg)` の中にタイプセレクタで書く。（`wysiwyg-scope-root`）
  - 理由: 編集者は要素にクラスを付けられず、子孫セレクタで書くと詳細度が上がり、独自ブロックの側に打ち消しが要るため。
  - 補足: 本文エリアは、`scoped <名前>` の規約（第4章）の例外です。`.scoped` のクラスを付けられるのは、コードを書く人だけだからです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/wysiwyg/#rule-wysiwyg-scope-root
- 【推奨・本書の規約】編集画面から挿入する独自のブロックには `cms-` で始まるクラスを `class` 属性の先頭に付け、本文エリアの `@scope` を `to ([class|="cms"])` で手前で止める。（`wysiwyg-cms-prefix`）
  - 理由: 本文エリアの見出しや段落のスタイルが、独自ブロックの中に漏れるのを防ぐため。
  - 補足: `[class|="cms"]` は、`class` 属性の値の全体が `cms` か `cms-` で始まるときだけ一致します。`class="foo cms-x"` には一致しません。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/wysiwyg/#rule-wysiwyg-cms-prefix
- 【推奨・本書の規約】CMS の本文エリアに限り、`@scope` のネストと、独自ブロックの `@scope` での `to()` の省略を認める。（`wysiwyg-scope-exception`）
  - 理由: 本文エリアと独自ブロックの2段だけで、ブロックの中にコンポーネントを置かない前提が成り立てば、スタイルの漏れが起きにくいため。
  - 補足: ブロックの中にコンポーネントを入れるなら、通常の `@scope (.scoped.<名前>) to (.scoped)` に戻します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/wysiwyg/#rule-wysiwyg-scope-exception
- 【推奨・実装上の判断】本文のブロック間の余白は、2つ目以降の直下の子に `margin-block-start` を `rlh` で付け、見出しと独自ブロックの前だけ広げる。（`wysiwyg-flow-margin`）
  - 理由: 見出しや段落の行間が違っても、余白がルート要素の行の高さの倍数で揃うため。
  - 補足: 中にブロックを持つ `blockquote` などは、中の余白を `0.5rlh` に詰めます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/wysiwyg/#rule-wysiwyg-flow-margin

## 19-6 既存のサイトに段階的に導入する

https://t-arai-pnrm.github.io/css-coding-guideline/operations/adoption/

- 【推奨・実装上の判断】既存のサイトに本書の規約を入れるときは、全体を一度に書き換えず、新しく作るコンポーネントと、変更で手を入れるページやコンポーネントから適用する。（`adopt-new-components-first`）
  - 理由: 書き換えのためだけに表示の確認を増やさず、規約の違う部分を変更のたびに減らせるため。
  - 補足: 変更の予定がない箇所は、規約と違っていても書き換えない。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/adoption/#rule-adopt-new-components-first
- 【推奨・実装上の判断】既存のサイトにレイヤーを入れるときは、既存のCSSを `@import url("…") layer(vendors);` で `vendors` レイヤーに入れ、新しいCSSを後ろのレイヤーに書く。（`legacy-css-into-vendors`）
  - 理由: レイヤーの外に残った既存のCSSは、詳細度に関係なく新しいCSSに勝つため。`vendors` に入れれば、既存のページの表示を保ったまま、新しいコンポーネントを優先できる。
  - 補足: 既存のCSSを読み込み直せない環境では、`no-layers-with-unlayered-css` に従う。リセットとベーススタイルは、既存のページの表示を確かめられる段階で足す。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/adoption/#rule-legacy-css-into-vendors
- 【推奨・実装上の判断】Stylelint は新しいCSSを置くディレクトリから適用し、既存のCSSのディレクトリは `ignoreFiles` で外して、書き換えたファイルから検査の対象に戻す。（`lint-new-code-first`）
  - 理由: 既存のCSSの大量の違反に、新しいコードの違反が埋もれないようにするため。`ignoreFiles` に残るパスが、規約で書かれていないCSSの一覧になる。
  - 補足: 外すのは規約で書いていないコードだけで、新しいコードの違反を隠す目的では使わない（`no-disabling-to-silence`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/operations/adoption/#rule-lint-new-code-first
