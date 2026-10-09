---
name: task-approve
description: タスクの plan.md を承認し、status を approved にする。利用者が呼ぶ。
argument-hint: <タスクのスラッグの一部>
disable-model-invocation: true
---

`tasks/` の直下（`tasks/archive/` を除く）から、名前に「$ARGUMENTS」を含むタスクを探し、plan.md を承認する。複数見つかったら、一覧を示して選んでもらう。

1. plan.md の status が draft でなければ、今の status を伝えて止まる。
2. 「懸念・確認事項」に回答のない問いがあれば、一覧にして、このまま承認するかを尋ねる。承認すると答えるまで、status を変えない。
3. plan.md の frontmatter を `status: approved` と `approved: <今日の日付>` にし、決定ログに「<今日の日付>：承認」と追記する。
4. 実装は `/task-start <slug>` で始めるよう案内する。このスキルでは実装に進まない。
