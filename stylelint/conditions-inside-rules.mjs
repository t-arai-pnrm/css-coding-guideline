/**
 * `@media` と `@container` を、セレクタ（スタイルルール）の中に書くことを求めるルール。
 *
 * `@scope` や `@layer` の直下に条件付きのアットルールを置くと、`order/order` の並び順
 * （アットルールをルールより前に置く）によって、上書きのための条件が元のルールより前に並ぶ。
 * 同じ詳細度では後に書いたほうが勝つので、上書きが効かなくなる。条件を各セレクタの中に
 * 書けば、この問題は起きない（第9章「ネストの書き方」）。
 */
import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'book/conditions-inside-rules';

const messages = ruleMessages(ruleName, {
  rejected: (name) =>
    `\`@${name}\`はセレクタの中に書いてください。条件付きのアットルールをセレクタの外に置くと、上書きの順序が崩れます。`,
});

const TARGETS = new Set(['media', 'container']);

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => (root, result) => {
  const valid = validateOptions(result, ruleName, { actual: primary, possible: [true] });
  if (!valid) return;

  root.walkAtRules((atRule) => {
    if (!TARGETS.has(atRule.name.toLowerCase())) return;
    for (let parent = atRule.parent; parent && parent.type !== 'root'; parent = parent.parent) {
      if (parent.type === 'rule') return;
    }
    report({
      result,
      ruleName,
      message: messages.rejected(atRule.name),
      node: atRule,
      word: `@${atRule.name}`,
    });
  });
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default createPlugin(ruleName, ruleFunction);
