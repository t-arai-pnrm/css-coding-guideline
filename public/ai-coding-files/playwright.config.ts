import { defineConfig, devices } from '@playwright/test';

/**
 * 20-6 の値の照合テスト（tests/design-values.spec.ts）を動かすための、最小の設定。
 * プロジェクトのルートに置く。
 *
 * テストページ（tests/pages/article-cards/）を、静的なファイルのサーバーで配信する。
 * プロジェクトに開発サーバーがあれば、webServer の command と url、use の baseURL を、
 * その開発サーバーのものに書き換え、テストページも開発サーバーで配信する。
 */
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command: 'npx --yes serve@14.2.4 -l 4173 .',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
  },
  // 本書の対象ブラウザ（Chrome、Safari、Firefox）のエンジンで自動確認する。
  // Playwright の WebKit は Safari そのものではなく、Safari より先の実装を含むこともある。
  // Safari と iOS での表示は、実機で別に確かめる。
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
