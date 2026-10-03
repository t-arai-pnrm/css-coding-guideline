/**
 * 要素自身の状態（擬似クラス・擬似要素・属性）を、ネストせずにセレクタへ連結しているルールを探す。
 * 例：`[popover]:popover-open { … }` は、`[popover] { &:popover-open { … } }` と書く（ルール `nest-own-states`）。
 *
 * 使い方: node scripts/find-unnested-states.mjs [ファイル…]
 * 引数がなければ、原稿の CSS のコード例とデモの CSS をすべて調べる。
 */
import { readFile, readdir } from 'node:fs/promises';
import { realpathSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createRequire } from 'node:module';

// postcss は Stylelint の依存として入っているので、Stylelint の実体の場所から読み込む
const require = createRequire(join(realpathSync('node_modules/stylelint'), 'package.json'));
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

const ROOT = process.cwd();

const listFiles = async (dir, ext) => {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(ext))
    .map((entry) => join(entry.parentPath, entry.name));
};

/** 1つの複合セレクタ（結合子で区切られた単位）が、主語に状態を連結しているか */
const hasAttachedState = (compound) => {
  const [first, ...rest] = compound;
  if (!first || rest.length === 0) return false;
  // 先頭が擬似クラスだけ（`:focus-visible`、`:root`、`:where(…)` など）の場合も、続く状態は連結とみなす
  return rest.some((node) => node.type === 'pseudo' || node.type === 'attribute');
};

const findInSelector = (selector) => {
  const hits = [];
  selectorParser((root) => {
    root.each((sel) => {
      const compounds = [[]];
      sel.each((node) => {
        if (node.type === 'combinator') compounds.push([]);
        else if (node.type !== 'comment') compounds.at(-1).push(node);
      });
      // 先頭が `&` のセレクタは、すでにネストしている
      if (compounds[0][0]?.type === 'nesting') return;
      compounds.forEach((compound, index) => {
        if (hasAttachedState(compound)) {
          hits.push({ selector: sel.toString().trim(), subject: index === compounds.length - 1 });
        }
      });
    });
  }).processSync(selector);
  return hits;
};

const check = (css, label, results) => {
  let root;
  try {
    root = postcss.parse(css);
  } catch {
    return;
  }
  root.walkRules((rule) => {
    // ネストしたルール（親がルール）は対象外
    if (rule.parent?.type === 'rule') return;
    if (rule.parent?.type === 'atrule' && rule.parent.name === 'keyframes') return;
    for (const hit of findInSelector(rule.selector)) {
      results.push(`${label}:${rule.source?.start?.line ?? '?'}\t${hit.subject ? 'SUBJECT' : 'ANCESTOR'}\t${hit.selector}`);
    }
  });
};

const results = [];
const args = process.argv.slice(2);
const mdxFiles = args.length ? args.filter((f) => f.endsWith('.mdx')) : await listFiles(join(ROOT, 'src/content/docs'), '.mdx');
const cssFiles = args.length ? args.filter((f) => f.endsWith('.css')) : await listFiles(join(ROOT, 'src/demos'), '.css');

for (const file of mdxFiles) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/^```css([^\n]*)\n([\s\S]*?)^```/gm)) {
    const line = source.slice(0, match.index).split('\n').length;
    const bad = match[1].includes('Not Recommended') ? ' [NG例]' : '';
    check(match[2], `${relative(ROOT, file)}:${line}${bad}`, results);
  }
}
for (const file of cssFiles) {
  check(await readFile(file, 'utf8'), relative(ROOT, file), results);
}

console.log(results.join('\n'));
console.log(`${results.length} 件`);
