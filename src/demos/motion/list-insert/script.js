const root = document.querySelector('.scoped.invite-list');
const list = root.querySelector('ul');
const names = ['高橋さん', '田中さん', '伊藤さん', '渡辺さん', '山本さん'];
let count = 0;

// append() した項目は、@starting-style の値からフェードインする
root.querySelector('._add').addEventListener('click', () => {
  const item = document.createElement('li');
  item.className = '_item';
  item.innerHTML = '<span class="_name"></span><button type="button" class="_remove">取り消す</button>';
  item.querySelector('._name').textContent = names[count % names.length];
  count += 1;
  list.append(item);
});

// remove() した項目は、退場の動きなしで即座に消える
list.addEventListener('click', (event) => {
  event.target.closest('._remove')?.closest('._item').remove();
});
