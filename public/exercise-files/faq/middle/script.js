// 絞り込みのボタンを表示し、押したボタンの aria-pressed と、各質問の hidden を切り替える
for (const root of document.querySelectorAll('.faq-list')) {
  const filter = root.querySelector('._filter');
  const buttons = filter.querySelectorAll('button');
  const items = root.querySelectorAll('details');

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const { category } = button.dataset;
      for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
      for (const item of items) item.hidden = category !== 'all' && item.dataset.category !== category;
    });
  }

  // 初期化が終わってから表示する。スクリプトが動かない環境では、すべての質問が並ぶだけになる
  filter.hidden = false;
}
