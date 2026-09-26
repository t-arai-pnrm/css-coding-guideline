/**
 * 本書の Stylelint 設定。astro-template の設定をもとに、次の点を変えている。
 * - ネストの規約（深さは 2 まで、ネストしたセレクタは `&` で始める）を追加
 * - ベンダープレフィックスの例外をなくした（例外の指定が効いていなかったため）
 * - `@media` と `@container` をセレクタの中に書くことを求める独自ルールを追加
 * - z-index の数値の禁止パターンが 10〜19 などを通していた問題を修正
 *
 * @type {import('stylelint').Config}
 */
export default {
  // `*.bad.css` は 🙅‍♂ Not Recommended のデモなので検証しない
  ignoreFiles: ['dist/**', 'node_modules/**', 'src/demos/**/*.bad.css'],
  overrides: [
    {
      files: ['**/*.astro'],
      customSyntax: 'postcss-html',
    },
  ],
  extends: ['stylelint-config-standard', 'taks-stylelint-order'],
  plugins: [
    'stylelint-plugin-logical-css',
    'stylelint-order',
    'stylelint-plugin-display-multi-keyword-syntax',
    './stylelint/conditions-inside-rules.mjs',
  ],
  rules: {
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
        ignoreAtRules: ['import'],
      },
    ],
    'at-rule-property-required-list': {
      'font-face': ['font-family', 'src'],
    },
    'book/conditions-inside-rules': true,
    'container-name-pattern': [
      '^--[a-z][a-z0-9]*(-[a-z0-9]+)*$',
      {
        message: (name) => `コンテナ名「${name}」は、\`--\`で始まる kebab-case の名前にしてください。`,
      },
    ],
    'custom-property-empty-line-before': [
      'always',
      {
        except: ['after-custom-property', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    'block-no-empty': null,
    'no-empty-source': null,
    'color-hex-alpha': 'never',
    'color-named': 'never',
    'custom-property-pattern': null,
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: ['/^grid.+/', '/overflow/'],
      },
    ],
    'declaration-property-unit-allowed-list': {
      'line-height': [],
    },
    'unit-disallowed-list': [
      ['vw', 'vh', 'vi', 'vb', 'vmin', 'vmax'],
      {
        message: (unit) => {
          // 物理方向の svw・svh を勧めると論理単位の警告に掛かるので、論理方向の単位を勧める
          const recommendationMap = {
            vw: 'svi, dvi, lvi',
            vh: 'svb, dvb, lvb',
            vi: 'svi, dvi, lvi',
            vb: 'svb, dvb, lvb',
            vmin: 'svmin, dvmin, lvmin',
            vmax: 'svmax, dvmax, lvmax',
          };
          return `\`${unit}\`は使用しないでください。代わりに\`${recommendationMap[unit]}\`を検討してください。`;
        },
        severity: 'warning',
      },
    ],
    'declaration-property-value-disallowed-list': [
      {
        // 1 と -1 以外の数値を禁止する
        'z-index': ['/^-?(?:[2-9]|[1-9]\\d+)$/', '/^0$/'],
        // 改行したときに行が詰まりすぎるため（第9章 9-3）
        'line-height': ['/^1$/'],
      },
      {
        message: (name, value) =>
          name === 'line-height'
            ? '`line-height: 1`は使用しないでください。ハーフレディングを取り除くなら`text-box-trim`を使用してください。'
            : `数値\`${value}\`は\`${name}\`プロパティで使用しないでください。z-index のトークンを使用してください。`,
        severity: 'warning',
      },
    ],
    'declaration-property-value-no-unknown': [
      true,
      {
        ignoreProperties: {
          'word-break': 'auto-phrase',
          'inline-size': ['/^round\\(/', '/^calc-size\\(/'],
        },
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['anchor', 'anchor-size'],
      },
    ],
    'function-url-no-scheme-relative': true,
    // ignoreAtRules は「数えない」ではなく「中を検査しない」になるので使わない。
    // `@layer` の中の `@scope` は 1 段に数えられる（第5章 5-2）。
    'max-nesting-depth': 2,
    'media-feature-name-value-no-unknown': true,
    'no-descending-specificity': null,
    'order/order': [
      [
        'custom-properties',
        'declarations',
        {
          type: 'at-rule',
          name: 'supports',
          hasBlock: true,
        },
        {
          type: 'at-rule',
          name: 'container',
          hasBlock: true,
        },
        {
          type: 'at-rule',
          name: 'media',
          hasBlock: true,
        },
        'rules',
      ],
      { unspecified: 'bottom' },
    ],
    'plugin/display-multi-keyword-syntax': true,
    'logical-css/require-logical-properties': [
      true,
      {
        ignore: ['overflow-x', 'overflow-y'],
        severity: 'warning',
      },
    ],
    'logical-css/require-logical-units': [
      true,
      {
        severity: 'warning',
      },
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'field-sizing',
          'reading-flow',
          'reading-order',
          'navigation',
          'interpolate-size',
          'text-box',
          'interactivity',
          'corner-shape',
          'text-decoration-inset',
        ],
      },
    ],
    // 例外は設けない。必要なプレフィックスは、理由のコメントと無効化のコメントを添えて書く（第5章 5-3）。
    'property-no-vendor-prefix': true,
    'keyframes-name-pattern': /^--[\w][\w-]*$/,
    'selector-class-pattern': null,
    'selector-max-id': 0,
    'selector-max-universal': [
      1,
      {
        ignoreAfterCombinators: ['+'],
      },
    ],
    'selector-nested-pattern': /^&/,
    'selector-pseudo-element-colon-notation': 'double',
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['scroll-button'],
      },
    ],
    'value-keyword-case': [
      'lower',
      {
        camelCaseSvgKeywords: true,
      },
    ],
  },
};
