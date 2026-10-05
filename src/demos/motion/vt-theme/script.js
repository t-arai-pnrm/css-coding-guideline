const root = document.documentElement;
const button = document.querySelector('._toggle');

const update = () => {
  const isDark = root.dataset.theme === 'dark';
  root.dataset.theme = isDark ? 'light' : 'dark';
  button.setAttribute('aria-pressed', String(!isDark));
};

button.addEventListener('click', () => {
  if (document.startViewTransition) {
    // 種類を渡し、CSS の :active-view-transition-type() で選べるようにする
    document.startViewTransition({ update, types: ['theme-toggle'] });
  } else {
    update();
  }
});
