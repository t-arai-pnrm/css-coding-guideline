/**
 * 子要素のクラスの下にある要素を、タイプセレクタで選んでいるルールを探す（ルール `no-type-under-child-class`）。
 * - 子孫結合子：`._section p`、`._section { & p { … } }` は、ネストしていても対象
 * - 子結合子：`._section > p` のように1つのセレクタに並べたものは対象。`._section { & > p { … } }` とネストしたものは対象外
 * `:has()` や `:not()` などの括弧の中は調べない。
 *
 * 使い方: node scripts/find-type-under-child.mjs [ファイル…]
 * 引数がなければ、原稿の CSS のコード例とデモの CSS をすべて調べる。
 * Not Recommended のコード例と `style.bad.css` は対象外。CMSの本文のように、
 * マークアップにクラスを付けられない領域の指定は、意図して残してよい。
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

/** セレクタを、複合セレクタと結合子の列に分ける（括弧の中は見ない） */
const toCompounds = (sel) => {
  const compounds = [{ nodes: [], combinator: null }];
  sel.each((node) => {
    if (node.type === 'combinator') compounds.push({ nodes: [], combinator: node.value.trim() || ' ' });
    else if (node.type !== 'comment') compounds.at(-1).nodes.push(node);
  });
  return compounds;
};

const isChildClass = (compound) => compound.nodes.some((node) => node.type === 'class' && node.value.startsWith('_'));
const startsWithType = (compound) => compound.nodes[0]?.type === 'tag';
const isNesting = (compound) => compound.nodes[0]?.type === 'nesting';

/**
 * selector：そのルールに書いたセレクタ
 * parentHasChildClass：親のルールのセレクタが子要素のクラスを含むか
 */
const findInSelector = (selector, parentHasChildClass) => {
  const hits = [];
  selectorParser((root) => {
    root.each((sel) => {
      const compounds = toCompounds(sel);
      compounds.forEach((compound, index) => {
        const next = compounds[index + 1];
        if (!next || !startsWithType(next)) return;
        const underChild = isChildClass(compound) || (isNesting(compound) && parentHasChildClass);
        if (!underChild) return;
        if (next.combinator === ' ') hits.push({ selector: sel.toString().trim(), kind: '子孫結合子' });
        if (next.combinator === '>' && !isNesting(compound)) hits.push({ selector: sel.toString().trim(), kind: 'ネストしていない子結合子' });
      });
    });
  }).processSync(selector);
  return hits;
};

const parentHasChildClass = (rule) => {
  const parent = rule.parent;
  return parent?.type === 'rule' && /(^|[\s>+~,(])\._[a-z0-9-]/.test(parent.selector);
};

const check = (css, label, results) => {
  let root;
  try {
    root = postcss.parse(css);
  } catch {
    return;
  }
  root.walkRules((rule) => {
    if (rule.parent?.type === 'atrule' && rule.parent.name === 'keyframes') return;
    for (const hit of findInSelector(rule.selector, parentHasChildClass(rule))) {
      results.push(`${label}:${rule.source?.start?.line ?? '?'}\t${hit.kind}\t${hit.selector}`);
    }
  });
};

const results = [];
const args = process.argv.slice(2);
const mdxFiles = args.length ? args.filter((f) => f.endsWith('.mdx')) : await listFiles(join(ROOT, 'src/content/docs'), '.mdx');
const cssFiles = (args.length ? args.filter((f) => f.endsWith('.css')) : await listFiles(join(ROOT, 'src/demos'), '.css')).filter(
  (f) => !f.endsWith('.bad.css'),
);

for (const file of mdxFiles) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/^```css([^\n]*)\n([\s\S]*?)^```/gm)) {
    if (match[1].includes('Not Recommended')) continue;
    const line = source.slice(0, match.index).split('\n').length;
    check(match[2], `${relative(ROOT, file)}:${line}`, results);
  }
}
for (const file of cssFiles) {
  check(await readFile(file, 'utf8'), relative(ROOT, file), results);
}

console.log(results.join('\n'));
console.log(`${results.length} 件`);
