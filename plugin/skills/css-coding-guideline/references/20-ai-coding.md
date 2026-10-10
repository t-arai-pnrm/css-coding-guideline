# 第20章 AIにコーディングさせる：ルール

- ガイドラインのバージョン: 0.47.4（2026-10-10 生成）
- ルールの数: 14
- 本文: 約7.3万字
- 読む条件: AIが書いたCSS、Figmaなどのデザインツールから書いたCSS

このファイルは「CSSコーディングガイドライン」のルールから自動生成しています。直接編集しないでください。
強度は「必須」「推奨」「非推奨」「禁止」の4段階です。「必須」と「禁止」は、各ルールの補足に書いた適用範囲と例外を除いて必ず守り、「推奨」と「非推奨」は理由があれば外れてかまいません。
性質は3種類です。「仕様上の制約」はCSS・HTML・ブラウザの振る舞いやWCAGから導かれ、守らないと表示や操作が崩れます。「実装上の判断」は状況とトレードオフで決まり、適用する条件があります。「本書の規約」は一貫性のために本書が選んだ約束で、ほかの約束を選んでも同じように成り立ちます。
背景とコード例は、各節の本文にあります。本文は MCP の `get_page`（ページID）か、URL で読みます。

## この章の節

- `ai-coding` 第20章AIにコーディングさせる（約3,900字）https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/
- `ai-coding/roles` 20-1 AIに任せる範囲と人が担う範囲（約3,800字）https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/roles/
- `ai-coding/setup` 20-2 AIに読ませる規約を用意する（約7,100字）https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/setup/
- `ai-coding/mcp-servers` 20-3 MCPサーバーを役割で使い分ける（約1万字）https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/mcp-servers/
- `ai-coding/tasks` 20-4タスクの単位で進める（約1.5万字）https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/tasks/
- `ai-coding/from-figma` 20-5 Figmaのデザインから計画を立てる（約1.1万字）https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/from-figma/
- `ai-coding/implementation` 20-6実装と検証を回す（約1.1万字）https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/implementation/
- `ai-coding/pitfalls` 20-7 AIが誤りやすいパターン（約4,900字）https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/pitfalls/
- `ai-coding/verify-output` 20-8生成したコードを確かめ、教訓を残す（約6,300字）https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/verify-output/

## 20-1 AIに任せる範囲と人が担う範囲

https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/roles/

- 【必須・実装上の判断】AI が生成した CSS は、Stylelint とレビューの両方で確かめてから採用する。（`verify-ai-output`）
  - 理由: Stylelint で検出できるのはルールの一部で、lint が通っても規約を守っているとは限らないため。
  - 補足: レビューでは、lint で検出できない「AI が誤りやすい」ルールを重点的に確かめます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/roles/#rule-verify-ai-output

## 20-2 AIに読ませる規約を用意する

https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/setup/

- 【推奨・実装上の判断】AI に CSS を書かせるときやレビューさせるときは、先に本書のルールを、スキルか MCP サーバーで読ませる。（`ai-read-rules-first`）
  - 理由: AI が誤りやすいルールを、書く前に確認させられるため。
  - 補足: Claude Code では本書のプラグインを入れ、ほかのツールではスキルと MCP サーバーを設定します。どちらも使えないツールでは、`AGENTS.md` からスキルのルール集の URL を参照させます（付録J「AIツールで使う」）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/setup/#rule-ai-read-rules-first

## 20-3 MCPサーバーを役割で使い分ける

https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/mcp-servers/

- 【禁止・実装上の判断】Figma などのデザインツールが出力したコードの、Tailwind のクラス、絶対配置の座標、固定の幅と高さを、そのまま CSS に写さない。（`no-verbatim-design-output`）
  - 理由: 出力はカンプの1つの幅と内容を再現した試作で、幅や内容が変わったときの振る舞いを含まず、プロジェクトのトークンと規約にも沿わないため。
  - 補足: 出力は、余白、文字の大きさ、色などの値と、要素の並び方を読み取るために使います。値はトークンに対応づけてから書きます（`figma-values-to-tokens`）。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/mcp-servers/#rule-no-verbatim-design-output
- 【推奨・実装上の判断】実装をデザインと見比べるときは、デザインと同じ幅で撮ったスクリーンショットを並べる。（`compare-at-design-width`）
  - 理由: 幅が違うと、折り返す位置やコンテナサイズクエリの状態が変わり、不具合ではない差と本当の差を見分けられないため。
  - 補足: スクリーンショットの一致は合否の基準にしません。カンプのない幅での振る舞いは、brief の完了条件で確かめます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/mcp-servers/#rule-compare-at-design-width

## 20-4タスクの単位で進める

https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/tasks/

- 【必須・実装上の判断】デザインと指示にない値や振る舞い（カンプのない幅、状態の見た目、内容が増えたときの見せ方）を、推測で作って完成として扱わない。（`no-guessing-missing-design`）
  - 理由: 推測で作った見た目は、デザインの意図と食い違っていても確かめられないまま残り、後から作り直しになるため。
  - 補足: AI に書かせるときは、推測が要る点で作業を止めさせ、選択肢と推奨を示して確かめます。仮の値で書き進める場合は、報告に「未確認」として残します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/tasks/#rule-no-guessing-missing-design

## 20-5 Figmaのデザインから計画を立てる

https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/from-figma/

- 【推奨・実装上の判断】デザインの値は、CSS を書く前にトークンに対応づけ、トークンに当たらない値は例外として理由とともに書き出す。（`figma-values-to-tokens`）
  - 理由: カンプの値を1つずつ写すと、トークンと少しずつ違う値が増え、デザインの共通のルールがコードから読み取れなくなるため。
  - 補足: トークンに近いがずれる値は、どちらで書くかをデザイナーに確かめます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/from-figma/#rule-figma-values-to-tokens
- 【推奨・実装上の判断】AI に CSS を書かせるときは、トークン、ベーススタイル、レイヤーの順番、コンポジションのように全ページに及ぶ変更を、コンポーネントの中で閉じる変更と分け、着手する前に人が確かめる。（`escalate-shared-changes`）
  - 理由: 全ページに及ぶ変更は、対象のコンポーネントでは正しく見えても、ほかのページの表示を変えることがあり、コンポーネントの確認では見落とすため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/from-figma/#rule-escalate-shared-changes

## 20-6実装と検証を回す

https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/implementation/

- 【推奨・実装上の判断】lint とビルドが通っても、書いた宣言が適用されているかを、ブラウザの計算値で確かめる。（`verify-applied-styles`）
  - 理由: 自分自身を問い合わせるスタイルクエリのように、構文が正しくても条件が成り立たず適用されない宣言は、lint では検出できないため。
  - 補足: `getComputedStyle` で計算値を読むか、開発者ツールでどの宣言が勝ったかを確かめます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/implementation/#rule-verify-applied-styles
- 【必須・実装上の判断】実行していない検査と、人が判定する項目は、完了の報告で「未確認」と書き、「問題なし」と書かない。（`report-unverified-honestly`）
  - 理由: 未確認の項目が「問題なし」と報告されると、人が確かめる機会がなくなり、崩れが公開まで残るため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/implementation/#rule-report-unverified-honestly
- 【禁止・実装上の判断】VRT の基準画像を、差分の原因を確かめずに、テストを通すためだけに更新しない。（`no-baseline-update-to-pass`）
  - 理由: 原因の分からない差分を基準画像に取り込むと、崩れが正しい表示として固定され、以後のテストで検出できなくなるため。
  - 補足: 基準画像を更新するのは、意図した変更で表示が変わったことを、変わった箇所ごとに確かめたときだけです。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/implementation/#rule-no-baseline-update-to-pass

## 20-7 AIが誤りやすいパターン

https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/pitfalls/

- 【推奨・実装上の判断】「まだ使えない」「未対応」を理由に CSS の機能を避けたり JavaScript で作り直したりする提案は、Baseline などで現在の対応状況を確かめてから受け入れる。（`verify-support-claims`）
  - 理由: AI の知識は学習した時点で止まっていて、`@scope`、アンカーポジショニング、View Transitions のように対応が進んだ機能を、未対応とみなすことがあるため。
  - 補足: 対象の一部のブラウザが未対応でも、未対応の環境向けの表示を CSS で用意すれば、プログレッシブ・エンハンスメントとして使えます。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/pitfalls/#rule-verify-support-claims
- 【推奨・本書の規約】プロジェクトで採用を決めていない限り、Tailwind CSS のユーティリティや CSS-in-JS で書かず、コンポーネントのクラスと `@scope` で書く。（`no-unrequested-css-framework`）
  - 理由: ユーティリティだけで組む前提を持ち込むと、本書の設計（スコープ、公開プロパティ、レイヤー）と食い違い、規約で確かめられないコードになるため。
  - 補足: ユーティリティは `.-visually-hidden` のような単機能のクラスに限ります（第10章のルール `utility-single-purpose`）。Vue の `<style scoped>` や Astro の `<style>` のように、フレームワークがスコープの仕組みを持つ場合は `@scope` だけをそれに置き換え、命名、レイヤー、コンテナ名の規約は残します。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/pitfalls/#rule-no-unrequested-css-framework
- 【推奨・実装上の判断】AI にレイアウトを書かせるときは、配置を `grid-template-areas` で定義し、エリアに名前を付けるよう先に指示する。（`ai-layout-with-grid-areas`）
  - 理由: 指示しないと Flexbox と `position: absolute` に偏り、親の1か所で決まるはずの配置が子要素の指定に散らばるため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/pitfalls/#rule-ai-layout-with-grid-areas

## 20-8生成したコードを確かめ、教訓を残す

https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/verify-output/

- 【推奨・実装上の判断】AI の出力を直したら、同じ誤りを繰り返さないように、プロジェクトの規約の文書に書き足す。（`record-ai-corrections`）
  - 理由: 直した内容が文書に残れば、次の作業でも同じ説明を繰り返さずに済むため。
  - 詳細: https://t-arai-pnrm.github.io/css-coding-guideline/ai-coding/verify-output/#rule-record-ai-corrections
