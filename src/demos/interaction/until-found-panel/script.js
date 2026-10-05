const initializeDisclosure = (link) => {
  const panel = document.getElementById(link.hash.slice(1));
  if (!panel) return;
  link.setAttribute('role', 'button');
  link.setAttribute('aria-controls', panel.id);
  link.setAttribute('aria-expanded', 'false');
  panel.hidden = 'until-found';
  panel.addEventListener('beforematch', () => link.setAttribute('aria-expanded', 'true'));

  // クリックで開閉する。ページ内リンクとしての移動は止める
  const toggle = () => {
    const expanded = link.getAttribute('aria-expanded') !== 'true';
    link.setAttribute('aria-expanded', String(expanded));
    panel.hidden = expanded ? false : 'until-found';
  };
  link.addEventListener('click', (event) => {
    event.preventDefault();
    toggle();
  });

  // role="button" にしたので、Space キーでも開閉する（Enter キーはクリックとして届く）
  link.addEventListener('keydown', (event) => {
    if (event.key !== ' ') return;
    event.preventDefault();
    toggle();
  });
};

for (const link of document.querySelectorAll('.scoped.shipping-section h2 > a')) {
  initializeDisclosure(link);
}
