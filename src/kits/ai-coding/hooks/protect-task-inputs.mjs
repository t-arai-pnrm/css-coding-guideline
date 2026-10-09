// tasks/ の brief.md（書き出した後）と refs/ を、AI の書き込みから守る PreToolUse のフック。
// .claude/settings.json で、Write と Edit のツールに登録する。
// Bash のリダイレクトなど、ほかのツールでの書き込みは防げない。取り決めの見落としを止める仕組みとして使う。
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const input = JSON.parse(readFileSync(0, 'utf8'));
const filePath = input.tool_input?.file_path;
if (!filePath) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR ?? input.cwd;
const absolute = path.resolve(input.cwd, filePath);
const relative = path.relative(root, absolute).split(path.sep).join('/');

// tasks/<slug>/ と tasks/archive/<slug>/ の両方を守る
const task = /^tasks\/(?:archive\/)?[^/]+\//;
let reason;
if (task.test(relative) && relative.includes('/refs/')) {
  reason = 'refs/ は人が用意するファイルです。AI は書き込みません。';
} else if (task.test(relative) && relative.endsWith('/brief.md') && existsSync(absolute)) {
  reason = 'brief.md は人が書くファイルです。直したい点は、チャットで人に伝えてください。';
}

if (reason) {
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    }),
  );
}
