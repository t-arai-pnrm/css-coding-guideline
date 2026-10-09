# AIにコーディングさせるためのひな形

「CSSコーディングガイドライン」第20章「AIにコーディングさせる」で使うひな形です。使い方は、本書の 20-4「タスクの単位で進める」で説明しています。

プロジェクトにコピーし、確かめる幅や完了条件の既定を、プロジェクトに合わせて書き換えてください。

| 配布ファイル | プロジェクトに置く場所 |
| --- | --- |
| `skills/task-new/` | `.claude/skills/task-new/` |
| `skills/task-start/` | `.claude/skills/task-start/` |
| `skills/task-approve/` | `.claude/skills/task-approve/` |
| `skills/task-done/` | `.claude/skills/task-done/` |
| `skills/confirm-request/` | `.claude/skills/confirm-request/` |
| `hooks/protect-task-inputs.mjs` | `.claude/hooks/protect-task-inputs.mjs` |
| `settings.json` | `.claude/settings.json`（`hooks` を足す） |
| `mcp.json` | `.mcp.json` |
| `tasks/lessons.md` | `tasks/lessons.md` |
| `CLAUDE.md` | `CLAUDE.md`（CSS に関わる部分の例） |
| `playwright.config.ts` | プロジェクトのルート（開発サーバーのコマンドと URL に書き換える） |
| `tests/design-values.spec.ts` | `tests/design-values.spec.ts` |
| `tests/pages/article-card/` | `tests/pages/article-card/`（テストページと、演習の 21-7 を終えた時点の CSS） |

Codex、Cursor、GitHub Copilot では、`skills/` の5つを `.agents/skills/` に置きます。フックと `settings.json` は Claude Code の仕組みなので、ほかのツールでは使えません。

テストの動かし方は、本書の 20-6「実装と検証を回す」の「この例を試すための最小構成」で説明しています。

ライセンスは MIT-0 です。
