const button = document.querySelector('.global-header ._drawer-button');
const background = document.querySelectorAll('body > :not(.global-header)');

// 開閉に合わせて aria-expanded を切り替え、ヘッダー以外の要素に inert を付け外しする
button.addEventListener('click', () => {
  const expanded = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(expanded));
  for (const element of background) element.inert = expanded;
});
