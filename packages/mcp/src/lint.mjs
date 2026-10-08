/**
 * 本書の Stylelint 設定で CSS を検査する。
 * 設定と独自ルールは、scripts/gen-ai.mjs が data/stylelint/ に写したものを使う。
 * 設定のうち、本書のリポジトリにしか当てはまらない指定（ファイルの除外、.astro の構文）は外す。
 */
import { fileURLToPath, pathToFileURL } from 'node:url';
import stylelint from 'stylelint';

const CONFIG_DIR = fileURLToPath(new URL('../data/stylelint/', import.meta.url));

let bookConfig;
const loadBookConfig = async () => {
  bookConfig ??= (await import(pathToFileURL(`${CONFIG_DIR}stylelint.config.mjs`).href)).default;
  return bookConfig;
};

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * レイヤー名の制限（`layer-name-pattern`）は、プロジェクトで宣言したレイヤー名を `layers` に渡したときだけ検査する。
 * 本書のレイヤーの名前は、ほかのプロジェクトのものと同じとは限らないため。
 */
export const lintCss = async ({ code, layers }) => {
  const { ignoreFiles, overrides, ...config } = await loadBookConfig();
  const rules = { ...config.rules };
  if (layers && layers.length > 0) {
    rules['layer-name-pattern'] = [
      `^(${layers.map(escapeRegExp).join('|')})$`,
      {
        message: (name) => `レイヤー名「${name}」は宣言されていません。先頭の\`@layer\`文で宣言した名前を使用してください。`,
      },
    ];
  } else {
    delete rules['layer-name-pattern'];
  }
  const { results } = await stylelint.lint({ code, config: { ...config, rules }, configBasedir: CONFIG_DIR });
  const [result] = results;
  return {
    warnings: result.warnings.map(({ line, column, rule, severity, text }) => ({ line, column, rule, severity, text })),
    invalidOptions: result.invalidOptionWarnings.map(({ text }) => text),
  };
};

/** ルールの「自動チェック」の欄から、Stylelint のルール名と本書のルール ID の対応を作る。 */
export const mapStylelintRules = (rules) => {
  const map = new Map();
  for (const rule of rules) {
    if (!rule.lint?.startsWith('Stylelint:')) continue;
    for (const [, name] of rule.lint.matchAll(/`([a-z0-9/-]+)`/g)) {
      if (!map.has(name)) map.set(name, []);
      map.get(name).push(rule.id);
    }
  }
  return map;
};
