const toolbar = document.querySelector('.scoped.format-toolbar');
const COOLDOWN = 400;
let cooldownTimer;

const show = (item) => {
  clearTimeout(cooldownTimer);
  for (const opened of toolbar.querySelectorAll('._item[data-open]')) {
    if (opened !== item) opened.removeAttribute('data-open');
  }
  item.setAttribute('data-open', '');
};

// 離れてから COOLDOWN の間に別のボタンに触れたら、遅延なしで表示を続ける
const hide = (item) => {
  item.removeAttribute('data-open');
  clearTimeout(cooldownTimer);
  cooldownTimer = setTimeout(() => {
    toolbar.removeAttribute('data-warm');
  }, COOLDOWN);
};

for (const item of toolbar.querySelectorAll('._item')) {
  const button = item.querySelector('button');
  item.addEventListener('pointerenter', () => show(item));
  item.addEventListener('pointerleave', () => hide(item));
  button.addEventListener('focus', () => {
    if (button.matches(':focus-visible')) show(item);
  });
  button.addEventListener('blur', () => hide(item));

  // 遅延が明けて表示が始まったら、ウォームアップに入る
  item.querySelector('._tooltip').addEventListener('transitionstart', () => {
    if (item.hasAttribute('data-open')) toolbar.setAttribute('data-warm', '');
  });
}

// Esc キーで、表示しているツールチップを閉じる
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  for (const opened of toolbar.querySelectorAll('._item[data-open]')) hide(opened);
});
