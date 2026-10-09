# <プロジェクトの名前>

<!--
CSS に関わる部分の例です。コマンド、ディレクトリの構成など、プロジェクトの全体の説明は別に書きます。
書くのは、選択肢があるときの判断基準と、本書と違うこのプロジェクトの規約です。
本書のルールで足りることは ID で参照し、本文を写しません。
-->

## CSS

- CSS は「CSSコーディングガイドライン」に従う。書く前とレビューの前に、css-coding-guideline スキルの手順を読む。判断の根拠には、ルールの ID を添える。
- このプロジェクトで本書と違う規約（本書のルールより優先する）：
  - <!-- 例：WordPress のコアのスタイルと共存するので、`@layer` を使わない（`no-layers-with-unlayered-css`） -->
  - <!-- 例：ブレイクポイントは 768px の1つだけにする -->
- トークンにない値は、トークンを増やさずにその場で直接書き、plan の値の対応表に例外として理由を書く。トークンを足すときは、人に確かめる。
- 確かめる幅は、320 / 480 / 768 / 1024 / 1280px。

## Figma

- Figma の MCP でデザインを読むのは、`/task-start` で plan を書くときだけ。承認された plan で実装するときは `get_design_context` を呼ばず、plan の値の対応表に従う。完了を確かめるときは、`get_screenshot` で見比べる画像だけを取る。
- `get_design_context` が返すコードは、値を読むために使う。React、Tailwind のクラス、絶対配置の座標、固定の幅と高さをそのまま写さない（`no-verbatim-design-output`）。
- デザインのスクリーンショットは見比べる目安にする。合否は brief の完了条件で決める。

## 検証

- 完了と報告する前に、lint とビルドを実行する。lint のエラーを消すためにルールを無効にしない（`no-disabling-to-silence`）。
- 宣言が効いているかは、`getComputedStyle` で計算値を読んで確かめる（`verify-applied-styles`）。
- 実行していない検査を「問題なし」と報告しない（`report-unverified-honestly`）。
- VRT の基準画像は、差分の原因を確かめずに更新しない（`no-baseline-update-to-pass`）。

## タスク

- 3つ以上の手順がかかる作業は、`/task-new` でタスクを作ってから進める。1つのファイルの値を直すだけのような小さな修正は、タスクにしない。
- `tasks/*/brief.md` と `tasks/*/refs/` は人のファイル。編集しない。
- plan.md の status を approved にするのは `/task-approve` だけ。
- デザイナーやディレクターに確かめる点は、`/confirm-request` で確認依頼の文面にする。送るのは人。
