const launcher = document.querySelector('.scoped.help-launcher');
const dialog = launcher.querySelector('dialog');

// show() で開くと open 属性は付くが、:modal には当てはまらない
launcher.querySelector('._show').addEventListener('click', () => {
  if (!dialog.open) dialog.show();
});

// モーダルでなく開いたままでも切り替えられるように、いったん閉じてから command に任せる
launcher.querySelector('[command="show-modal"]').addEventListener('click', () => {
  if (dialog.open) dialog.close();
});
