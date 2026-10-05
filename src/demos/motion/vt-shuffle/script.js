const list = document.querySelector('.scoped.product-list');
const button = document.querySelector('._shuffle');

// 項目をランダムに並べ替える
const update = () => {
  const items = [...list.children];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  list.append(...items);
};

button.addEventListener('click', () => {
  if (document.startViewTransition) {
    document.startViewTransition(update);
  } else {
    update();
  }
});
