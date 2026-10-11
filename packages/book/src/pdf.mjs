/**
 * out/vol<N>/book.html を Vivliostyle で PDF（out/vol<N>.pdf）にする。
 *
 * 使い方: node src/pdf.mjs [巻の番号（省略すると1）]
 */
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { CHROME } from './capture.mjs';

const HERE = new URL('../', import.meta.url).pathname;
const number = Number(process.argv[2] ?? 1);
const input = join(HERE, 'out', `vol${number}`, 'book.html');
const output = join(HERE, 'out', `vol${number}.pdf`);

const child = spawn(
  join(HERE, 'node_modules/.bin/vivliostyle'),
  ['build', input, '--output', output, '--size', '182mm,235mm', '--executable-browser', CHROME, '--timeout', '1200'],
  { stdio: 'inherit' },
);
child.on('exit', (code) => process.exit(code ?? 1));
