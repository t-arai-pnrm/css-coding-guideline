// デモの iframe（srcdoc）では、#… のリンクが本のページの URL として解決され、iframe の中に本のページを読み込んでしまう。
// そのため、ページ内リンクのクリックをフラグメントの変更に置き換えて、通常のページと同じく :target を切り替える。
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  event.preventDefault();
  location.hash = link.getAttribute('href');
});
