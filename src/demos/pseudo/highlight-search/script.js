const root = document.querySelector('.scoped.text-search');
const input = root.querySelector('input');
const status = root.querySelector('._status');
const body = root.querySelector('._body');

// 入力した語に一致する範囲を、本文のテキストノードからすべて集める
const findRanges = (query) => {
  const ranges = [];
  const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.data.toLowerCase();
    let index = text.indexOf(query);
    while (index !== -1) {
      const range = new Range();
      range.setStart(node, index);
      range.setEnd(node, index + query.length);
      ranges.push(range);
      index = text.indexOf(query, index + query.length);
    }
  }
  return ranges;
};

const update = () => {
  const query = input.value.trim().toLowerCase();
  const ranges = query ? findRanges(query) : [];
  // 同じ名前で登録し直すと、前のハイライトは置き換わる
  CSS.highlights.set('search-result', new Highlight(...ranges));
  // 色だけに頼らず、一致した数を文章でも伝える
  status.textContent = query ? `${ranges.length}件が一致しました` : '';
};

if ('highlights' in CSS) {
  input.addEventListener('input', update);
  update();
} else {
  status.textContent = 'このブラウザは CSS Custom Highlight API に対応していません。';
}
