# CSSコーディングガイドライン

CSS の記法と設計の知識をまとめた、実務のためのコーディングガイドラインです。著者は TAK。本文は Web で公開しています。

https://t-arai-pnrm.github.io/css-coding-guideline/

## AI ツールで使う

**スキル、MCP サーバー、プラグインは、現在、提供に向けて対応中のため、まだ利用できません（2026年10月時点）。** 以下は、提供を始めたときの使い方です。

本書のルールは、ほかのプロジェクトの AI ツールから参照できます。Claude Code では、スキルと MCP サーバーをまとめたプラグインを入れます。

```sh
claude plugin marketplace add t-arai-pnrm/css-coding-guideline
claude plugin install css-coding-guideline@css-coding-guideline
```

Cursor、Codex、GitHub Copilot では、スキルを `npx skills add t-arai-pnrm/css-coding-guideline` で入れ、MCP サーバー（npm の [`css-coding-guideline-mcp`](./packages/mcp/)）を各ツールの設定に登録します。ツールごとの手順は、付録J「[AIツールで使う](https://t-arai-pnrm.github.io/css-coding-guideline/appendix/ai-tools/)」にあります。

## リポジトリの構成

- `src/content/docs/`：原稿（Astro Starlight）
- `src/content/rules/`：ルールの定義。ページのガイドライン、付録A、スキル、MCP サーバーのデータは、すべてここから作る
- `plugin/`：Claude Code のプラグインとスキル（`pnpm gen:ai` で生成）
- `packages/mcp/`：MCP サーバー
- `stylelint.config.mjs`、`stylelint/`：本書の Stylelint の設定と独自ルール

## ライセンス

文章は CC BY 4.0、コードは MIT-0 です。詳しくは [LICENSE.md](./LICENSE.md) を見てください。
