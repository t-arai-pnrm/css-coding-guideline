/**
 * 刊行前に解消する印（`{/* 要確認: … *\/}` と `{/* 要検証: … *\/}`）を、種類ごとに一覧にする。
 * 種類は「要確認: 出典なし」「要確認: 著者の判断」「要検証: ブラウザ」の3つ。これ以外の書き方は「種類なし」として出す。
 * 原稿のほかに、EXTRA_FILES も調べる。印はそのファイルのコメントの書き方で付ける
 * （Markdown は `<!-- 要確認: … -->`、JavaScript は `// 要確認: …`）。
 *
 * 使い方: node scripts/list-markers.mjs [--summary] [ファイル…]
 * 引数がなければ、原稿と EXTRA_FILES をすべて調べる。--summary を付けると、種類ごとの件数だけを出す。
 */
import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const ROOT = process.cwd();
const DOCS = join(ROOT, 'src/content/docs');
/** 原稿の外で、刊行前に直す箇所があるファイル。 */
const EXTRA_FILES = ['README.md', 'astro.config.mjs'];
const KINDS = ['要確認: 出典なし', '要確認: 著者の判断', '要検証: ブラウザ'];
const UNKNOWN = '種類なし';

/** ファイルの種類ごとの、印の書き方。 */
const MARKER_PATTERNS = {
  '.mdx': /\{\/\*\s*((?:要確認|要検証):[^*]*?)\s*\*\/\}/g,
  '.md': /<!--\s*((?:要確認|要検証):[\s\S]*?)\s*-->/g,
  '.mjs': /\/\/\s*((?:要確認|要検証):.*?)\s*$/g,
};

const args = process.argv.slice(2);
const summaryOnly = args.includes('--summary');
const targets = args.filter((arg) => !arg.startsWith('--'));

const listFiles = async () => {
  const entries = await readdir(DOCS, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => join(entry.parentPath, entry.name))
    .sort()
    .concat(EXTRA_FILES.map((file) => join(ROOT, file)));
};

const files = targets.length > 0 ? targets.map((file) => join(ROOT, file)) : await listFiles();
const groups = new Map([...KINDS, UNKNOWN].map((kind) => [kind, []]));

for (const file of files) {
  const pattern = MARKER_PATTERNS[extname(file)] ?? MARKER_PATTERNS['.mdx'];
  const lines = (await readFile(file, 'utf8')).split('\n');
  lines.forEach((line, index) => {
    for (const [, body] of line.matchAll(pattern)) {
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
