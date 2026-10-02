/**
 * 起点のない `:has()`（`:has(.foo)` や `*:has(.foo)`）を禁止するルール。
 *
 * `:has()` の直前に起点となるセレクタがないと、すべての要素が照合の対象になり、
 * DOM が変わるたびのスタイルの再計算が重くなる（第3章「:has() で祖先と前の兄弟を選ぶ」）。
 * 起点として認めるのは、タイプ（`*` を除く）、クラス、ID、属性、`&`、`:scope`、`:root`、`:host`。
 * `&:not(:has(> img))` のように擬似クラスの引数の中にある `:has()` は、外側の擬似クラスの起点を見る。
 */
import selectorParser from 'postcss-selector-parser';
import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'book/no-unanchored-has';

const messages = ruleMessages(ruleName, {
  rejected: (selector) =>
    `\`${selector}\`の\`:has()\`には起点がありません。\`&:has()\`や\`.card:has()\`のように、直前に起点のセレクタを書いてください。`,
});

const ANCHOR_PSEUDOS = new Set([':scope', ':root', ':host']);

/** 複合セレクタ（結合子で区切られたまとまり）のうち、node を含む部分を返す。 */
const compoundOf = (node) => {
  const nodes = node.parent.nodes;
  const index = nodes.indexOf(node);
  let start = index;
  while (start > 0 && nodes[start - 1].type !== 'combinator') start -= 1;
  let end = index;
  while (end < nodes.length - 1 && nodes[end + 1].type !== 'combinator') end += 1;
  return nodes.slice(start, end + 1);
};

const isAnchor = (node) => {
  switch (node.type) {
    case 'tag':
    case 'class':
    case 'id':
    case 'attribute':
    case 'nesting':
      return true;
    case 'pseudo':
      return ANCHOR_PSEUDOS.has(node.value.toLowerCase());
    default:
      return false;
  }
};

/** node を含む複合セレクタに起点があるか。擬似クラスの引数の中なら、外側をたどる。 */
const isAnchored = (node) => {
  if (compoundOf(node).some(isAnchor)) return true;
  // node.parent は selector、その親が擬似クラス（`:not()` など）なら、その擬似クラスの起点を見る
  const outerPseudo = node.parent.parent;
  if (outerPseudo?.type === 'pseudo') return isAnchored(outerPseudo);
  return false;
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => (root, result) => {
  const valid = validateOptions(result, ruleName, { actual: primary, possible: [true] });
  if (!valid) return;

  root.walkRules((rule) => {
    if (!rule.selector.toLowerCase().includes(':has(')) return;
    selectorParser((selectors) => {
      selectors.walkPseudos((pseudo) => {
        if (pseudo.value.toLowerCase() !== ':has') return;
        if (isAnchored(pseudo)) return;
        report({
          result,
          ruleName,
          message: messages.rejected(rule.selector),
          node: rule,
          word: ':has(',
        });
      });
    }).processSync(rule.selector);
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default createPlugin(ruleName, ruleFunction);
