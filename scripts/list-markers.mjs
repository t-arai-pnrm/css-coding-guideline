/**
 * 刊行前に解消する印（`{/* 要確認: … *\/}` と `{/* 要検証: … *\/}`）を、種類ごとに一覧にする。
 * 種類は「要確認: 出典なし」「要確認: 著者の判断」「要検証: ブラウザ」の3つ。これ以外の書き方は「種類なし」として出す。
 *
 * 使い方: node scripts/list-markers.mjs [--summary] [ファイル…]
 * 引数がなければ、原稿をすべて調べる。--summary を付けると、種類ごとの件数だけを出す。
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const DOCS = join(ROOT, 'src/content/docs');
const KINDS = ['要確認: 出典なし', '要確認: 著者の判断', '要検証: ブラウザ'];
const UNKNOWN = '種類なし';

const args = process.argv.slice(2);
const summaryOnly = args.includes('--summary');
const targets = args.filter((arg) => !arg.startsWith('--'));

const listFiles = async () => {
  const entries = await readdir(DOCS, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();
};

const files = targets.length > 0 ? targets.map((file) => join(ROOT, file)) : await listFiles();
const groups = new Map([...KINDS, UNKNOWN].map((kind) => [kind, []]));

for (const file of files) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  lines.forEach((line, index) => {
    for (const [, body] of line.matchAll(/\{\/\*\s*((?:要確認|要検証):[^*]*?)\s*\*\/\}/g)) {
      const kind = KINDS.find((name) => body === name || body.startsWith(`${name}。`)) ?? UNKNOWN;
      const detail = kind === UNKNOWN ? body : body.slice(kind.length + 1);
      groups.get(kind).push({ at: `${relative(ROOT, file)}:${index + 1}`, detail });
    }
  });
}

for (const [kind, items] of groups) {
  if (items.length === 0 && kind === UNKNOWN) continue;
  console.log(`## ${kind}（${items.length}件）`);
  if (summaryOnly) continue;
  console.log();
  for (const { at, detail } of items) console.log(detail ? `- ${at}：${detail}` : `- ${at}`);
  console.log();
}

if (groups.get(UNKNOWN).length > 0) process.exitCode = 1;
