/**
 * 本書を公開している場所。`astro.config.mjs` と、AI 向けの配布物（scripts/gen-ai.mjs）が使う。
 * 公開先を変えたら、ここを直して `pnpm gen:ai` を実行する。
 */

/** GitHub Pages のオリジン。 */
export const SITE = 'https://t-arai-pnrm.github.io';

/** GitHub Pages のプロジェクトサイトとして、サブパスで公開する。 */
export const BASE = '/css-coding-guideline';

/** ページ ID（例: `responsive/escalation`、トップは空文字）から公開 URL を作る。 */
export const pageUrl = (id) => (id ? `${SITE}${BASE}/${id}/` : `${SITE}${BASE}/`);

/** GitHub のリポジトリ。 */
export const REPOSITORY = 't-arai-pnrm/css-coding-guideline';
