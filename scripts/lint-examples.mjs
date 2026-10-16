/**
 * 原稿（MDX）の中の「🙆‍♂ Recommended」のCSSコード例を取り出し、本書の Stylelint 設定で検証する。
 * 🙅‍♂ Not Recommended の例とラベルのないコード例は検証しない。
 * あわせて、コード例の区別の属性（src/lib/code-labels.mjs の use、from、issue）を検査する。
 * - エラー：use と issue の値が違う、from の指す先がない、Not Recommended に issue がない
 * - 警告：from のデモの CSS に、抜粋の宣言の行がない（抜粋とデモの食い違い）。宣言がすべて同じ見出しの下のデモにあるのに from がない
 * デモの CSS（src/demos）は `pnpm lint:css` で検証する。
 * 引数にファイルを渡すとそのファイルだけを検証する（複数の作業を同時に走らせても衝突しない）。
 *
 * @example
 * node scripts/lint-examples.mjs src/content/docs/responsive/*.mdx
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import stylelint from 'stylelint';
import { CODE_ISSUES, CODE_USES, NOT_RECOMMENDED, RECOMMENDED, fromExists, isDistributedFile, parseCodeMeta } from '../src/lib/code-labels.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const DOCS_DIR = join(ROOT, 'src/content/docs');
const TMP_DIR = join(ROOT, `.tmp/examples-${process.pid}`);

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
  return { indent, fence, lang, ...parseCodeMeta(meta) };
};

/** 宣言の行（`property: value;`、カスタムプロパティを含む） */
const DECLARATION = /^-{0,2}[a-z_][\w-]*\s*:\s*.+;$/;

/** デモの CSS の行（前後の空白を除く）。from の抜粋を照らし合わせるのに使う */
const demoLines = async (from) => {
  for (const name of ['style.css', 'style.bad.css']) {
    try {
      return new Set((await readFile(join(ROOT, 'src/demos', from, name), 'utf8')).split('\n').map((line) => line.trim()));
    } catch {
      // 次の名前を試す
    }
  }
  return new Set();
};

/** コード例の区別の属性を検査し、エラーと警告を返す */
const checkLabels = async (source) => {
  const lines = source.split('\n');
  const demoImports = new Map(
    [...source.matchAll(/^import (\w+) from '[./]*\/demos\/([^']+?)\/style(?:\.bad)?\.css\?raw';$/gm)].map((match) => [match[1], match[2]]),
  );
  const problems = [];
  for (let i = 0; i < lines.length; i++) {
    const open = parseFence(lines[i]);
    if (!open) continue;
    const end = lines.findIndex(
      (line, index) => index > i && line.trim().startsWith(open.fence) && line.trim().replace(/[`~]/g, '') === '',
    );
    if (end === -1) break;
    const at = (severity, text) => problems.push({ line: i + 1, severity, text });
    const recommended = open.title.startsWith(RECOMMENDED);
    const notRecommended = open.title.startsWith(NOT_RECOMMENDED);
    if (open.use && !CODE_USES[open.use]) at('error', `use="${open.use}" は ${Object.keys(CODE_USES).join('、')} のどれかにしてください。`);
    if (open.issue && !CODE_ISSUES[open.issue]) at('error', `issue="${open.issue}" は ${Object.keys(CODE_ISSUES).join('、')} のどれかにしてください。`);
    if (notRecommended && !open.issue) at('error', 'Not Recommended に issue（behavior か convention）を付けてください。');
    if (open.from && !fromExists(open.from)) at('error', `from="${open.from}" の指す先がありません。`);
    if (recommended && open.lang === 'css') {
      if (open.from && !isDistributedFile(open.from) && (open.use ?? 'excerpt') === 'excerpt') {
        const pool = await demoLines(open.from);
        const missing = lines
          .slice(i + 1, end)
          .map((line) => line.trim())
          // 比べるのは宣言の行だけ。セレクタは、第7章のように素のクラスで書き直すことがある
          .filter((line) => DECLARATION.test(line) && !pool.has(line));
        if (missing.length) at('warning', `抜粋の ${missing.length} 行が、デモ ${open.from} の CSS にありません（例：${missing[0]}）。`);
      }
      if (!open.from) {
        // 宣言がすべて、同じ見出しの下のデモの CSS にあるなら、そのデモが全体なので from を求める
        let start = i;
        while (start > 0 && !/^#{2,3} /.test(lines[start])) start--;
        let stop = end;
        while (stop < lines.length && !/^#{2,3} /.test(lines[stop])) stop++;
        const declarations = lines.slice(i + 1, end).map((line) => line.trim()).filter((line) => DECLARATION.test(line));
        for (const [, demo] of lines.slice(start, stop).join('\n').matchAll(/<Demo\b[\s\S]*?\bcss=\{(\w+)\}/g)) {
          const from = demoImports.get(demo);
          if (!from || !declarations.length) continue;
          const pool = await demoLines(from);
          if (declarations.every((line) => pool.has(line))) {
            at('warning', `宣言がすべてデモ ${from} にあります。from="${from}" を付けてください。`);
            break;
          }
        }
      }
    }
    i = end;
  }
  return problems;
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
let labelErrors = 0;
let labelWarnings = 0;
const verbose = process.env.LINT_EXAMPLES_VERBOSE === '1';
for (const file of sources) {
  const source = await readFile(file, 'utf8');
  for (const problem of await checkLabels(source)) {
    if (problem.severity === 'error') labelErrors++;
    else labelWarnings++;
    if (problem.severity === 'error' || verbose) console.log(`${relative(ROOT, file)}:${problem.line}  ${problem.severity}  ${problem.text}`);
  }
  const examples = extractExamples(source);
  for (const [index, example] of examples.entries()) {
    const name = `${relative(DOCS_DIR, file).replaceAll('/', '__').replace(/\.mdx$/, '')}--${index + 1}.css`;
    const path = join(TMP_DIR, name);
    await writeFile(path, example.code);
    targets.push({ path, source: `${relative(ROOT, file)}:${example.line}` });
  }
}

if (labelWarnings) console.log(`\nコード例の区別の警告が ${labelWarnings} 件あります（LINT_EXAMPLES_VERBOSE=1 で一覧を出します）。`);

if (targets.length === 0) {
  await rm(TMP_DIR, { recursive: true, force: true });
  console.log('検証する Recommended のコード例はありません。');
  process.exit(labelErrors > 0 ? 1 : 0);
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
if (errorCount > 0 || labelErrors > 0) process.exit(1);
