/**
 * 原稿（MDX）の中の「🙆‍♂ Recommended」のCSSコード例を取り出し、本書の Stylelint 設定で検証する。
 * 🙅‍♂ Not Recommended の例とラベルのないコード例は検証しない。
 * デモの CSS（src/demos）は `pnpm lint:css` で検証する。
 * 引数にファイルを渡すとそのファイルだけを検証する（複数の作業を同時に走らせても衝突しない）。
 *
 * @example
 * node scripts/lint-examples.mjs src/content/docs/responsive/*.mdx
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import stylelint from 'stylelint';

const ROOT = new URL('..', import.meta.url).pathname;
const DOCS_DIR = join(ROOT, 'src/content/docs');
const TMP_DIR = join(ROOT, `.tmp/examples-${process.pid}`);
const RECOMMENDED = '🙆‍♂ Recommended';

const listMdx = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return listMdx(path);
      return entry.name.endsWith('.mdx') ? [path] : [];
    }),
  );
  return files.flat();
};

/** コードフェンスの開始行（```css title="…"）から、言語とタイトルを読む。 */
const parseFence = (line) => {
  const match = line.match(/^(\s*)(`{3,}|~{3,})\s*([\w-]*)(.*)$/);
  if (!match) return null;
  const [, indent, fence, lang, meta] = match;
  const title = meta.match(/title=(?:"([^"]*)"|'([^']*)')/);
  return { indent, fence, lang, title: title ? (title[1] ?? title[2]) : '' };
};

const extractExamples = (source) => {
  const lines = source.split('\n');
  const examples = [];
  for (let i = 0; i < lines.length; i++) {
    const open = parseFence(lines[i]);
    if (!open) continue;
    const end = lines.findIndex(
      (line, index) => index > i && line.trim().startsWith(open.fence) && line.trim().replace(/[`~]/g, '') === '',
    );
    if (end === -1) break;
    if (open.lang === 'css' && open.title.startsWith(RECOMMENDED)) {
      const code = lines
        .slice(i + 1, end)
        .map((line) => (line.startsWith(open.indent) ? line.slice(open.indent.length) : line))
        .join('\n');
      examples.push({ line: i + 2, code: `${code}\n` });
    }
    i = end;
  }
  return examples;
};

await rm(TMP_DIR, { recursive: true, force: true });
await mkdir(TMP_DIR, { recursive: true });

const sources = process.argv.length > 2 ? process.argv.slice(2).map((file) => resolve(file)) : await listMdx(DOCS_DIR);
const targets = [];
for (const file of sources) {
  const examples = extractExamples(await readFile(file, 'utf8'));
  for (const [index, example] of examples.entries()) {
    const name = `${relative(DOCS_DIR, file).replaceAll('/', '__').replace(/\.mdx$/, '')}--${index + 1}.css`;
    const path = join(TMP_DIR, name);
    await writeFile(path, example.code);
    targets.push({ path, source: `${relative(ROOT, file)}:${example.line}` });
  }
}

if (targets.length === 0) {
  await rm(TMP_DIR, { recursive: true, force: true });
  console.log('検証する Recommended のコード例はありません。');
  process.exit(0);
}

const { results } = await stylelint.lint({
  files: targets.map((target) => target.path),
  configFile: join(ROOT, 'stylelint.config.mjs'),
});

let errorCount = 0;
for (const result of results) {
  const target = targets.find((item) => item.path === result.source);
  const problems = [...result.warnings, ...(result.parseErrors ?? [])];
  if (problems.length === 0) continue;
  console.log(`\n${target?.source ?? result.source}`);
  for (const warning of problems) {
    if (warning.severity !== 'warning') errorCount++;
    console.log(`  ${warning.line}:${warning.column}  ${warning.severity ?? 'error'}  ${warning.text}`);
  }
}

await rm(TMP_DIR, { recursive: true, force: true });
console.log(`\n${targets.length} 件のコード例を検証しました。`);
if (errorCount > 0) process.exit(1);
