/**
 * ルールの文中にあるバッククォートの部分を `<code>` に変換した HTML を返す。
 * YAML のルール本文は信頼できる自前の文字列だが、念のため HTML の特殊文字はエスケープする。
 */
const escapeHtml = (text: string) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export const inlineCode = (text: string) =>
  text
    .split(/(`[^`]+`)/)
    .map((part) =>
      part.startsWith('`') && part.endsWith('`') && part.length > 1
        ? `<code>${escapeHtml(part.slice(1, -1))}</code>`
        : escapeHtml(part),
    )
    .join('');
