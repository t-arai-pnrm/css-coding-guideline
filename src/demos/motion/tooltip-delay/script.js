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

// ホバーとフォーカスを別々に覚え、どちらもなくなったときに閉じる
const states = new Map();

const update = (item) => {
  const state = states.get(item);
  if (state.dismissed || (!state.hover && !state.focus)) hide(item);
  else show(item);
};

for (const item of toolbar.querySelectorAll('._item')) {
  const button = item.querySelector('button');
  const state = { hover: false, focus: false, dismissed: false };
  states.set(item, state);

  // ツールチップは item の子孫なので、ボタンからツールチップへ移っても pointerleave は起きない
  item.addEventListener('pointerenter', () => {
    state.hover = true;
    state.dismissed = false;
    update(item);
  });
  item.addEventListener('pointerleave', () => {
    state.hover = false;
    update(item);
  });
  button.addEventListener('focus', () => {
    if (!button.matches(':focus-visible')) return;
    state.focus = true;
    state.dismissed = false;
    update(item);
  });
  button.addEventListener('blur', () => {
    state.focus = false;
    update(item);
  });

  // 遅延が明けて表示が始まったら、ウォームアップに入る
  item.querySelector('._tooltip').addEventListener('transitionstart', () => {
    if (item.hasAttribute('data-open')) toolbar.setAttribute('data-warm', '');
  });
}

// Esc キーで、表示しているツールチップを閉じる。ホバーやフォーカスが続いていても、入り直すまで開かない
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  for (const opened of toolbar.querySelectorAll('._item[data-open]')) {
    states.get(opened).dismissed = true;
    update(opened);
  }
});
