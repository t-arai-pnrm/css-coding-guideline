const tabs = [...document.querySelectorAll('.scoped.segmented-tabs ._tab')];

// 選んだタブに aria-selected="true" を付け、対応するパネルだけを表示する
const select = (selected) => {
  for (const tab of tabs) {
    const isSelected = tab === selected;
    tab.setAttribute('aria-selected', String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !isSelected;
  }
};

for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => select(tab));

  // 左右の矢印キーで隣のタブに、Home と End で端のタブに移る
  tab.addEventListener('keydown', (event) => {
    const next = {
      ArrowRight: tabs[(index + 1) % tabs.length],
      ArrowLeft: tabs[(index - 1 + tabs.length) % tabs.length],
      Home: tabs[0],
      End: tabs.at(-1),
    }[event.key];
    if (!next) return;
    event.preventDefault();
    select(next);
    next.focus();
  });
}
