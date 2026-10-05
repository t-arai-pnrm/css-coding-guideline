const root = document.querySelector('.scoped.check-field');
const all = root.querySelector('#check-field-all');
const items = [...root.querySelectorAll('[name="topic"]')];

// 子のチェックの数から、「すべて選ぶ」の状態を決める
const update = () => {
  const count = items.filter((item) => item.checked).length;
  all.checked = count === items.length;
  // 一部だけ選んでいるときは、中間の状態にする。HTMLの属性では書けない
  all.indeterminate = count > 0 && count < items.length;
};

all.addEventListener('change', () => {
  for (const item of items) item.checked = all.checked;
});

for (const item of items) item.addEventListener('change', update);
update();
