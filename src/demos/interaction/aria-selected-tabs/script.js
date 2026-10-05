const tabs = [...document.querySelectorAll('.scoped.tab-list [role="tab"]')];
const panelOf = (tab) => document.getElementById(tab.getAttribute('aria-controls'));

// 選んだタブだけを aria-selected="true" にする。見た目はこの属性から決まる
const select = (selected) => {
  for (const tab of tabs) {
    const isSelected = tab === selected;
    tab.setAttribute('aria-selected', String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    // 隠したパネルは、Tab キーの順序からも外す
    const panel = panelOf(tab);
    panel.hidden = isSelected ? false : 'until-found';
    panel.tabIndex = isSelected ? 0 : -1;
  }
};

for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => select(tab));

  // 左右の矢印キーで、隣のタブを選んでフォーカスを移す
  tab.addEventListener('keydown', (event) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = tabs.at((index + step) % tabs.length);
    select(next);
    next.focus();
  });

  // ページ内検索で隠れたパネルの中身が見つかったら、そのタブを選ぶ
  panelOf(tab).addEventListener('beforematch', () => select(tab));
}

select(tabs.find((tab) => tab.getAttribute('aria-selected') === 'true'));
