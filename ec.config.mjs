import { defineEcConfig } from '@astrojs/starlight/expressive-code';
import {
  CODE_ISSUES,
  CODE_USES,
  NOT_RECOMMENDED,
  RECOMMENDED,
  demoAnchor,
  fromText,
  isDistributedFile,
  loadDemoTitles,
} from './src/lib/code-labels.mjs';

const element = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
const text = (value) => ({ type: 'text', value });

/** hast の木から、最初の figcaption を探す */
const findCaption = (node) => {
  if (node.type === 'element' && node.tagName === 'figcaption') return node;
  for (const child of node.children ?? []) {
    const found = findCaption(child);
    if (found) return found;
  }
  return undefined;
};

/**
 * コード例の区別（`use`、`from`、`issue` の属性。src/lib/code-labels.mjs）を、タイトルの後ろに小さく出す。
 * 紙版が読めるように、ブロックの根元に data 属性も残す。
 */
const codeLabels = () => ({
  name: 'recss-code-labels',
  baseStyles: `
    .recss-code-label {
      align-content: center;
      margin-inline-start: 0.5rem;
      padding-inline: 0.4rem;
      border: 1px solid var(--sl-color-gray-4);
      border-radius: 999px;
      font-size: var(--sl-text-xs);
      font-weight: 400;
      white-space: nowrap;
    }

    .recss-code-from {
      align-content: center;
      margin-inline-start: 0.5rem;
      font-size: var(--sl-text-xs);
      font-weight: 400;
    }
  `,
  hooks: {
    postprocessRenderedBlockGroup: ({ renderedGroupContents }) => {
      for (const { codeBlock, renderedBlockAst } of renderedGroupContents) {
        const title = codeBlock.props.title ?? codeBlock.metaOptions.getString('title') ?? '';
        const recommended = title.startsWith(RECOMMENDED);
        if (!recommended && !title.startsWith(NOT_RECOMMENDED)) continue;
        const use = codeBlock.metaOptions.getString('use') ?? 'excerpt';
        const from = codeBlock.metaOptions.getString('from');
        const issue = codeBlock.metaOptions.getString('issue');
        const label = recommended ? CODE_USES[use] : CODE_ISSUES[issue];
        Object.assign(renderedBlockAst.properties, {
          dataCodeUse: recommended ? use : undefined,
          dataCodeFrom: from,
          dataCodeIssue: recommended ? undefined : issue,
        });
        const caption = findCaption(renderedBlockAst);
        if (!caption || !label) continue;
        caption.children.push(element('span', { className: ['recss-code-label'] }, [text(label)]));
        if (!from) continue;
        // デモはページ内のデモの枠へ、配布ファイルは名前だけを示す
        const demoTitle = isDistributedFile(from) ? undefined : loadDemoTitles().get(from);
        caption.children.push(
          demoTitle
            ? element('a', { className: ['recss-code-from'], href: `#${demoAnchor(demoTitle)}` }, [text(fromText(from))])
            : element('span', { className: ['recss-code-from'] }, [text(fromText(from))]),
        );
      }
    },
  },
});

export default defineEcConfig({
  defaultProps: {
    wrap: true,
  },
  plugins: [codeLabels()],
});
