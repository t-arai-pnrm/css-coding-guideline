/**
 * 本書の Stylelint 設定。astro-template の設定をもとに、次の点を変えている。
 * - ネストの規約（深さは 2 まで、ネストしたセレクタは `&` で始める）を追加
 * - ベンダープレフィックスの例外をなくした（例外の指定が効いていなかったため）
 * - `@media` と `@container` をセレクタの中に書くことを求める独自ルールを追加
 * - z-index の数値の禁止パターンを、1 と -1 も含むすべての整数に広げた（10〜19 などを通していた問題も解消）
 * - レイヤー名を、宣言した名前だけに限定（第2章 2-3）
 * - 起点のない `:has()` を禁止する独自ルールを追加（第3章 3-2）
 * - 見た目の順番を変えうる配置に `reading-flow` を求める独自ルールを追加（第10章 10-14）
 * - `order` と `reading-order` の値を 1 と -1 に限定（第10章 10-14）
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
    './stylelint/no-unanchored-has.mjs',
    './stylelint/reading-flow-when-reordered.mjs',
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
    'book/no-unanchored-has': true,
    'book/reading-flow-when-reordered': true,
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
    'declaration-property-value-allowed-list': [
      {
        // z-index の相対的な値と同じく、1 と -1 だけを使う（第10章 10-14）
        order: ['/^-?1$/', '/^(initial|inherit|unset|revert|revert-layer)$/'],
        'reading-order': ['/^-?1$/', '/^(initial|inherit|unset|revert|revert-layer)$/'],
      },
      {
        message: (name, value) => `\`${name}: ${value}\`は使用しないでください。\`${name}\`の値は 1 か -1 だけを使用します。`,
      },
    ],
    'declaration-property-value-disallowed-list': [
      {
        // 1 と -1 を含むすべての整数を禁止する（相対的な値も --z--forwards と --z--backwards で書く）
        'z-index': ['/^[+-]?\\d+$/'],
        // 改行したときに行が詰まりすぎるため（第13章 13-3）
        'line-height': ['/^1$/'],
      },
      {
        message: (name, value) =>
          name === 'line-height'
            ? '`line-height: 1`は使用しないでください。ハーフレディングを取り除くなら`text-box-trim`を使用してください。'
            : `数値\`${value}\`は\`${name}\`プロパティで使用しないでください。z-index のトークンを使用してください。1 と -1 も\`--z--forwards\`と\`--z--backwards\`で指定します。`,
        severity: 'warning',
      },
    ],
    'declaration-property-value-no-unknown': [
      true,
      {
        ignoreProperties: {
          'word-break': 'auto-phrase',
          display: '/grid-lanes$/',
          'inline-size': ['/^round\\(/', '/^calc-size\\(/', '-webkit-fill-available'],
        },
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['anchor', 'anchor-size', 'alpha'],
      },
    ],
    'function-url-no-scheme-relative': true,
    // セレクタのネストは 2 層までだが、@ルールを数えない設定が Stylelint にないので、検査しない（第7章 7-2）。
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
          'border-shape',
          'flow-tolerance',
          'text-decoration-inset',
        ],
      },
    ],
    // 例外は設けない。必要なプレフィックスは、理由のコメントと無効化のコメントを添えて書く（第7章 7-3）。
    'property-no-vendor-prefix': true,
    'keyframes-name-pattern': /^--[\w][\w-]*$/,
    // 打ち間違えたレイヤー名は、エラーにならず新しいレイヤーになる（第2章 2-3）。
    // `starlight` はこのサイトの CSS だけで使う、Starlight のレイヤー。
    'layer-name-pattern': [
      '^(tokens|reset|base|vendors|compositions|pages|components|patterns|utilities|starlight)$',
      {
        message: (name) => `レイヤー名「${name}」は宣言されていません。先頭の\`@layer\`文で宣言した名前を使用してください。`,
      },
    ],
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['target-current'],
      },
    ],
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
