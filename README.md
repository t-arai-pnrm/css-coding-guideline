# RECSSガイドライン

Reasonable Enduring CSS の略で、理由を説明でき、変化に耐える CSS の書き方を、基礎から学び直すためのガイドラインです。著者は TAK。本文は Web で公開しています。

https://t-arai-pnrm.github.io/recss-guideline/

## 書籍のサンプルと紙版

`pnpm gen:samples`で、本書と同じ版の最小構成、実務用のViteの構成、デモ、演習、共通トークン、AI向けの設定をZIPにまとめます。依存関係とファイルのSHA-256はmanifestに記録します。`pnpm build`はサンプルの生成も行います。

ZIPとmanifestは`public/sample-files/`に版別に保存します。展開先と補足サイトの一覧はビルド時に作ります。紙への変換と参照の規則は[書籍版のREADME](./packages/book/README.md)、レビューへの対応と刊行前に残る確認は[対応記録](./BOOK_REVIEW_RESPONSE.md)にあります。

## AI ツールで使う

<!-- 要確認: 著者の判断。配布物の提供を始めたら、次の段落を消す -->
**スキル、MCP サーバー、プラグインは、現在、提供に向けて対応中のため、まだ利用できません（2026年10月時点）。** 以下は、提供を始めたときの使い方です。

本書のルールは、ほかのプロジェクトの AI ツールから参照できます。Claude Code では、スキルと MCP サーバーをまとめたプラグインを入れます。

```sh
claude plugin marketplace add t-arai-pnrm/recss-guideline
claude plugin install recss-guideline@recss-guideline
```

Cursor、Codex、GitHub Copilot では、スキルを `npx skills add t-arai-pnrm/recss-guideline` で入れ、MCP サーバー（npm の [`recss-guideline-mcp`](./packages/mcp/)）を各ツールの設定に登録します。ツールごとの手順は、付録J「[AIツールで使う](https://t-arai-pnrm.github.io/recss-guideline/appendix/ai-tools/)」にあります。

## リポジトリの構成

- `src/content/docs/`：原稿（Astro Starlight）
- `src/content/rules/`：ルールの定義。ページのガイドライン、付録A、スキル、MCP サーバーのデータは、すべてここから作る
- `plugin/`：Claude Code のプラグインとスキル（`pnpm gen:ai` で生成）
- `packages/mcp/`：MCP サーバー
- `stylelint.config.mjs`、`stylelint/`：本書の Stylelint の設定と独自ルール

## ライセンス

文章は CC BY 4.0、コードは MIT-0 です。詳しくは [LICENSE.md](./LICENSE.md) を見てください。
