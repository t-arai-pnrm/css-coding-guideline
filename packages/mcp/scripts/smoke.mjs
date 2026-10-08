/**
 * MCP サーバーを stdio で起動し、すべてのツールを1回ずつ呼んで結果を確かめる。
 * `pnpm --filter css-coding-guideline-mcp smoke` で実行する。
 */
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';

const PROTOCOL_VERSION = process.argv[2] ?? '2025-06-18';
const child = spawn(process.execPath, [new URL('../src/index.mjs', import.meta.url).pathname], {
  stdio: ['pipe', 'pipe', 'inherit'],
});
const pending = new Map();
createInterface({ input: child.stdout }).on('line', (line) => {
  const message = JSON.parse(line);
  pending.get(message.id)?.(message);
  pending.delete(message.id);
});

let nextId = 1;
const request = (method, params) =>
  new Promise((resolve, reject) => {
    const id = nextId++;
    const timer = setTimeout(() => reject(new Error(`${method} の応答がありません。`)), 20_000);
    pending.set(id, (message) => {
      clearTimeout(timer);
      if (message.error) reject(new Error(`${method}: ${JSON.stringify(message.error)}`));
      else resolve(message.result);
    });
    child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`);
  });
const notify = (method, params) => child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`);

const failures = [];
const call = async (name, args, { expectError = false, expect } = {}) => {
  const result = await request('tools/call', { name, arguments: args });
  const body = result.content.map((entry) => entry.text).join('\n');
  const ok = Boolean(result.isError) === expectError && (!expect || expect.test(body));
  if (!ok) failures.push(name);
  console.log(`\n── ${ok ? '✓' : '✗'} ${name} ${JSON.stringify(args).slice(0, 80)}\n${body.slice(0, 600)}${body.length > 600 ? `\n…（全 ${body.length} 文字）` : ''}`);
};

try {
  const init = await request('initialize', {
    protocolVersion: PROTOCOL_VERSION,
    capabilities: {},
    clientInfo: { name: 'smoke', version: '0.0.0' },
  });
  console.log(`initialize: ${init.serverInfo.name} ${init.serverInfo.version}（プロトコル ${init.protocolVersion}）`);
  if (!init.instructions) failures.push('instructions');
  notify('notifications/initialized', {});

  const { tools } = await request('tools/list', {});
  console.log(`tools: ${tools.map((tool) => tool.name).join(', ')}`);
  const expected = ['search_rules', 'get_rule', 'get_page', 'list_chapters', 'lint_css'];
  if (expected.some((name) => !tools.some((tool) => tool.name === name))) failures.push('tools/list');

  await call('search_rules', { query: 'コンテナ', aiProne: true, limit: 5 }, { expect: /件中/ });
  await call('search_rules', { chapter: 13, level: '必須', limit: 3 }, { expect: /件中/ });
  await call('search_rules', { chapter: 'nothing' }, { expectError: true });
  await call('get_rule', { ids: ['query-range-syntax', 'no-vw-vh-typo'] }, { expect: /理由: .*\n[\s\S]*近いID/ });
  await call('get_page', { page: '13-5', heading: '範囲構文' }, { expect: /## 範囲構文で書く/ });
  await call('get_page', { page: 'https://t-arai-pnrm.github.io/css-coding-guideline/cascade/layers/' }, { expect: /4-3/ });
  await call('get_page', { page: '存在しないページ' }, { expectError: true });
  await call('list_chapters', {}, { expect: /第13章 レスポンシブデザイン/ });
  await call(
    'lint_css',
    {
      code: '.card-list {\n  display: grid;\n  width: 100%;\n}\n\n@container (width >= 600px) {\n  .card-list {\n    grid-template-columns: repeat(3, 1fr) !important;\n  }\n}\n',
    },
    { expect: /display-multi-keyword-syntax[\s\S]*conditions-inside-rules|conditions-inside-rules[\s\S]*display/ },
  );
  await call(
    'lint_css',
    { code: '@layer base {\n  p {\n    margin: 0;\n  }\n}\n\n@layer component {\n}\n', layers: ['base', 'components'] },
    { expect: /component/ },
  );
} catch (error) {
  failures.push(error.message);
} finally {
  child.kill();
}

if (failures.length > 0) {
  console.error(`\n失敗: ${failures.join(', ')}`);
  process.exit(1);
}
console.log('\nすべてのツールが期待どおりに応答しました。');
