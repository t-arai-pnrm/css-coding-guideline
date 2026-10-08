# 本書のデモの共通トークン

- ガイドラインのバージョン: 0.42.2（2026-10-08 生成）
- 元のファイル: src/demos/tokens/*.css（付録I）

本書のデモは、次のトークンを `@layer tokens` に入れて読み込んでいる。デモからは、色はセマンティクス（`--background--*`、`--foreground--*`、`--border--*`）だけを、文字は役割（`--text--<役割>--font-size` と `--text--<役割>--leading`）を参照する。

## colors.css

```css
/*
 * 色のトークン。デモからはセマンティクスだけを参照し、プリミティブは直接参照しない。
 * デモはサイトのテーマに追従するので、セマンティクスには light-dark() で両方の値を持たせる。
 */
:root {
  /* プリミティブ */
  --color--neutral--50: oklch(98.5% 0 0deg);
  --color--neutral--100: oklch(97% 0 0deg);
  --color--neutral--200: oklch(92.2% 0 0deg);
  --color--neutral--300: oklch(87% 0 0deg);
  --color--neutral--400: oklch(70.8% 0 0deg);
  --color--neutral--500: oklch(55.6% 0 0deg);
  --color--neutral--600: oklch(43.9% 0 0deg);
  --color--neutral--700: oklch(37.1% 0 0deg);
  --color--neutral--800: oklch(26.9% 0 0deg);
  --color--neutral--900: oklch(20.5% 0 0deg);
  --color--neutral--950: oklch(14.5% 0 0deg);
  --color--accent--400: oklch(70% 0.15 260deg);
  --color--accent--500: oklch(62% 0.19 260deg);
  --color--accent--600: oklch(54% 0.22 260deg);
  --color--accent--700: oklch(48% 0.2 260deg);
  --color--red--400: oklch(70.4% 0.191 22.216deg);
  --color--red--500: oklch(63.7% 0.237 25.331deg);
  --color--red--600: oklch(57.7% 0.245 27.325deg);
  --color--green--400: oklch(79.2% 0.209 151.711deg);
  --color--green--700: oklch(52.7% 0.154 150.069deg);

  /*
   * 面。ライトでは base 以外を白にし、高さは影で表す。
   * ダークでは影が見えにくいので、高い面ほど背景を明るくする。
   * メニューはダイアログの中でも開くので、raised を overlay より明るくする。
   */
  --background--base: light-dark(var(--color--neutral--50), var(--color--neutral--900));
  --background--surface: light-dark(oklch(100% 0 0deg), oklch(from var(--color--neutral--900) calc(l + 0.05) c h));
  --background--overlay: light-dark(oklch(100% 0 0deg), oklch(from var(--color--neutral--900) calc(l + 0.085) c h));
  --background--raised: light-dark(oklch(100% 0 0deg), oklch(from var(--color--neutral--900) calc(l + 0.12) c h));

  /* 背景が透明な項目に重ねる色。どの面の上でも同じ見え方になるよう、半透明にする */
  --background--hover: light-dark(oklch(0% 0 0deg / 4%), oklch(100% 0 0deg / 6%));
  --background--active: light-dark(oklch(0% 0 0deg / 7%), oklch(100% 0 0deg / 10%));

  /* 主ボタンのように、文字色で塗る面 */
  --background--inverse: light-dark(var(--color--neutral--900), var(--color--neutral--100));
  --background--accent: light-dark(var(--color--accent--600), var(--color--accent--500));

  /* 選んだ状態や範囲を示す淡い青。半透明にして、どの面の上でもなじませる */
  --background--accent-subtle: color-mix(in oklab, var(--foreground--accent) 12%, transparent);
  --foreground--base: light-dark(var(--color--neutral--900), var(--color--neutral--100));
  --foreground--muted: light-dark(var(--color--neutral--500), var(--color--neutral--400));
  --foreground--accent: light-dark(var(--color--accent--600), var(--color--accent--400));
  --foreground--danger: light-dark(var(--color--red--600), var(--color--red--400));
  --foreground--success: light-dark(var(--color--green--700), var(--color--green--400));
  --foreground--inverse: light-dark(var(--color--neutral--50), var(--color--neutral--900));
  --foreground--on-accent: oklch(100% 0 0deg);

  /* 枠線は文字色から作り、どの面の上でもなじませる */
  --border--base: color-mix(in oklab, var(--foreground--base) 12%, transparent);
  --border--strong: color-mix(in oklab, var(--foreground--base) 24%, transparent);
  --outline--focus: var(--foreground--accent);

  /*
   * 影の色。影の形（shadows.css）から参照する。
   * ダークでは、上辺のハイライトと内側の縁取りで面の端を見せる。ライトでは使わないので透明にする。
   */
  --shadow--color: light-dark(oklch(0% 0 0deg / 6%), oklch(0% 0 0deg / 18%));
  --shadow--ring-color: light-dark(oklch(0% 0 0deg / 6%), oklch(0% 0 0deg / 24%));
  --shadow--highlight-color: light-dark(transparent, oklch(100% 0 0deg / 4%));
}
```

## shadows.css

```css
/*
 * 影の形のトークン。段階が上がるほど、オフセットとぼかしを倍にした層を足す。
 * 各層の不透明度は同じで、重なるほど濃く、遠くまで落ちる。
 * 色は colors.css のセマンティクスを参照するので、ライトとダークで形を書き分けない。
 */
:root {
  --shadow--xs:
    inset 0 1px 0 0 var(--shadow--highlight-color),
    inset 0 0 0 1px var(--shadow--highlight-color),
    0 0 0 1px var(--shadow--ring-color);
  --shadow--sm:
    var(--shadow--xs),
    0 1px 1px -0.5px var(--shadow--color),
    0 3px 3px -1.5px var(--shadow--color);
  --shadow--md:
    var(--shadow--sm),
    0 6px 6px -3px var(--shadow--color),
    0 12px 12px -6px var(--shadow--color);
  --shadow--lg:
    var(--shadow--md),
    0 24px 24px -12px var(--shadow--color);
  --shadow--xl:
    var(--shadow--lg),
    0 48px 48px -24px var(--shadow--color);
}
```

## sizes.css

```css
/*
 * 大きさのトークン。余白は単位なしの px 相当の数値で、使う場所で px か rem に変換する。
 */
:root {
  --spacing--xxxs: 4;
  --spacing--xxs: 8;
  --spacing--xs: 12;
  --spacing--sm: 16;
  --spacing--md: 24;
  --spacing--lg: 32;
  --spacing--xl: 40;
  --spacing--xxl: 64;
  --spacing--xxxl: 80;
  --rounded--sm: 4px;
  --rounded--md: 8px;
  --rounded--lg: 12px;
  --rounded--full: calc(infinity * 1px);
}
```

## typography.css

```css
/*
 * 文字のトークン。文字サイズは単位なしの px 相当の数値で、使う場所で rem に変換する。
 * デモからは役割（--text--<役割>--*）を参照する。
 */
:root {
  /* プリミティブ */
  --font-size--xs: 12;
  --font-size--sm: 14;
  --font-size--md: 16;
  --font-size--lg: 18;
  --font-size--xl: 20;
  --font-size--xxl: 24;
  --font-size--xxxl: 28;
  --leading--tight: 1.25;
  --leading--snug: 1.4;
  --leading--normal: 1.6;
  --leading--relaxed: 1.75;
  --leading--loose: 2;
  --font-weight--regular: 400;
  --font-weight--bold: 700;

  /* 役割 */
  --text--display--font-size: var(--font-size--xxxl);
  --text--display--leading: var(--leading--tight);
  --text--title--font-size: var(--font-size--xl);
  --text--title--leading: var(--leading--snug);
  --text--subtitle--font-size: var(--font-size--md);
  --text--subtitle--leading: var(--leading--snug);
  --text--body--font-size: var(--font-size--md);
  --text--body--leading: var(--leading--relaxed);
  --text--body-compact--font-size: var(--font-size--sm);
  --text--body-compact--leading: var(--leading--normal);
  --text--caption--font-size: var(--font-size--xs);
  --text--caption--leading: var(--leading--normal);
}
```

## motion.css

```css
/*
 * 動きのトークン。fast はホバーとフォーカス、base はメニューとタブ、slow はダイアログに使う。
 */
:root {
  --ease--out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease--out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --ease--out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease--in-out-quint: cubic-bezier(0.86, 0, 0.07, 1);
  --ease--in-out-expo: cubic-bezier(0.87, 0, 0.13, 1);
  --duration--instant: 50ms;
  --duration--fast: 80ms;
  --duration--press: 120ms;
  --duration--base: 160ms;
  --duration--slow: 240ms;
  --duration--reveal: 600ms;
}
```

## z-index.css

```css
/*
 * 重なり順のトークン。絶対的な値は100刻み、相対的な値は1と-1だけにする。
 */
:root {
  --z--backwards: -1;
  --z--forwards: 1;
  --z--footer: 100;
  --z--header: 200;
  --z--top: calc(infinity);
}
```
