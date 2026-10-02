/**
 * 見た目の順番が DOM の順番から離れうる配置を書いたルールに、`reading-flow` を求めるルール。
 *
 * 次の宣言は、子の並ぶ順番を DOM の順番と違うものにできる。読み上げとキーボードの
 * フォーカスは DOM の順番で進むので、同じルールに `reading-flow` を書き、読み上げの順番を
 * 確かめたことをコードに残す（第10章「表示順と読み上げ順を合わせる」）。
 * - `grid-template-areas`（エリアの文字列を含む `grid-template` と `grid` も含む）。ただし、空のセルを含まず
 *   エリアの名前が1種類しかないテンプレート（`"--pile"` のように、すべての子を同じセルに重ねるもの）は並べ替えにならないので除く
 * - `flex-direction: row-reverse | column-reverse`（`flex-flow` も含む）
 * - `flex-wrap: wrap-reverse`（`flex-flow` も含む）
 * - `grid-auto-flow` の `dense`（`grid` の `auto-flow dense` も含む）
 *
 * `reading-flow` は、宣言と同じブロックか、`@media` や `@container` の中に書いた宣言なら
 * その外側のスタイルルールまでのどこかにあればよい。値は問わない（`normal` も認める）。
 * 子の `order` や `grid-row`・`grid-column` による並べ替えは、親のルールと結びつかないので検出しない。
 */
import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'book/reading-flow-when-reordered';

const messages = ruleMessages(ruleName, {
  rejected: (declaration) =>
    `\`${declaration}\`は見た目の順番をDOMの順番から変えることがあります。同じルールに\`reading-flow\`を指定してください。`,
});

const hasWord = (value, words) =>
  value
    .toLowerCase()
    .split(/[\s,/]+/)
    .some((word) => words.includes(word));

/**
 * テンプレートのセルが2種類以上あるか。空のセル（`.`）も1種類として数える。
 * 名前のないアイテムが空のセルに自動で入り、名前のあるエリアと順番が入れ替わることがあるため。
 */
const hasMultipleAreas = (value) => {
  const cells = new Set();
  for (const [, row] of value.matchAll(/["']([^"']*)["']/g)) {
    for (const cell of row.trim().split(/\s+/)) {
      if (cell !== '') cells.add(/^\.+$/.test(cell) ? '.' : cell);
    }
  }
  return cells.size > 1;
};

/** 宣言が、子の見た目の順番を DOM の順番から変えうるか。 */
const mayReorder = (prop, value) => {
  switch (prop) {
    case 'grid-template-areas':
      return hasMultipleAreas(value);
    case 'grid-template':
    case 'grid':
      // エリアの文字列を含むときだけ。`grid` は `auto-flow dense` も見る
      return hasMultipleAreas(value) || (prop === 'grid' && hasWord(value, ['dense']));
    case 'flex-direction':
      return hasWord(value, ['row-reverse', 'column-reverse']);
    case 'flex-wrap':
      return hasWord(value, ['wrap-reverse']);
    case 'flex-flow':
      return hasWord(value, ['row-reverse', 'column-reverse', 'wrap-reverse']);
    case 'grid-auto-flow':
      return hasWord(value, ['dense']);
    default:
      return false;
  }
};

const hasReadingFlow = (container) =>
  container.nodes?.some((node) => node.type === 'decl' && node.prop.toLowerCase() === 'reading-flow');

/** 宣言のブロックから、外側のスタイルルールまでのどこかに `reading-flow` があるか。 */
const isCovered = (decl) => {
  for (let parent = decl.parent; parent && parent.type !== 'root'; parent = parent.parent) {
    if (hasReadingFlow(parent)) return true;
    if (parent.type === 'rule') return false;
  }
  return false;
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => (root, result) => {
  const valid = validateOptions(result, ruleName, { actual: primary, possible: [true] });
  if (!valid) return;

  root.walkDecls((decl) => {
    const prop = decl.prop.toLowerCase();
    if (!mayReorder(prop, decl.value)) return;
    if (isCovered(decl)) return;
    // `grid-template` のテンプレートは長くなるので、値が長いときはプロパティ名だけを示す
    const value = decl.value.replace(/\s+/g, ' ');
    report({
      result,
      ruleName,
      message: messages.rejected(value.length > 32 ? decl.prop : `${decl.prop}: ${value}`),
      node: decl,
      word: decl.prop,
    });
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default createPlugin(ruleName, ruleFunction);
