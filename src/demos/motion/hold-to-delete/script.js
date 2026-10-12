// 押し続けた時間は、押し始めからのタイマーで測る。時間は CSS の --_duration（公開用の --hold-button--duration）から読み、進み具合の表示とそろえる。
// 押し切っても削除せず、確定できる状態にするだけにする。削除は、ボタンの上で離したときに確定する。
// 途中で離したとき、ボタンの外へ出たとき、pointercancel、フォーカスを失ったときは中止し、次に押したときは最初から数える。
// 押してすぐに離したときと、Enter キーやスクリーンリーダーで押したときは、command 属性で確認のダイアログを開く。
const demo = document.querySelector('.scoped.hold-demo');
const button = demo.querySelector('.scoped.hold-button');
const dialog = demo.querySelector('.scoped.confirm-dialog');
const status = demo.querySelector('._status');
let holdTimer;
let messageTimer;
let ready = false;
let confirmed = false;

// 2s や 2000ms の形で書いた時間を、ミリ秒の数に直す
const toMilliseconds = (time) => {
  const value = Number.parseFloat(time);
  return time.trim().endsWith('ms') ? value : value * 1000;
};

const remove = () => {
  status.textContent = '下書きを削除しました。';
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => {
    status.textContent = '';
  }, 3000);
};

const start = () => {
  if (button.dataset.holding === 'true') return;
  ready = false;
  confirmed = false;
  button.dataset.holding = 'true';
  const duration = toMilliseconds(getComputedStyle(button).getPropertyValue('--_duration'));
  holdTimer = setTimeout(() => {
    ready = true;
    status.textContent = '離すと削除します。';
  }, duration);
};

// 中止する。進み具合の表示も、判定も、最初に戻す
const cancel = () => {
  if (button.dataset.holding !== 'true') return;
  clearTimeout(holdTimer);
  if (ready) status.textContent = '';
  ready = false;
  delete button.dataset.holding;
};

// 離したときに、押し切っていれば削除を確定する。押し切る前なら中止し、続く click で確認のダイアログを開く
const finish = () => {
  if (button.dataset.holding !== 'true') return;
  const wasReady = ready;
  cancel();
  if (!wasReady) return;
  confirmed = true;
  remove();
};

button.addEventListener('pointerdown', (event) => {
  if (!event.isPrimary || event.button !== 0) return;
  // タッチでは押した要素がポインターを捕捉し、外へ出ても pointerleave が起きないので、捕捉を外す
  if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);
  start();
});
button.addEventListener('pointerup', (event) => {
  if (event.isPrimary) finish();
});
button.addEventListener('pointerleave', cancel);
button.addEventListener('pointercancel', cancel);
button.addEventListener('blur', cancel);

// Space キーを押し続ける操作も、同じ判定で扱う。Enter キーは押した時点で click が起きるので、判定を始めない
button.addEventListener('keydown', (event) => {
  if (event.key !== ' ' || event.repeat) return;
  start();
});
button.addEventListener('keyup', (event) => {
  if (event.key === ' ') finish();
});

// 押し切って離したあとに起きる click では、ダイアログを開かない
button.addEventListener('click', (event) => {
  if (!confirmed) return;
  confirmed = false;
  event.preventDefault();
});

dialog.addEventListener('close', () => {
  if (dialog.returnValue === 'delete') remove();
  dialog.returnValue = '';
});
