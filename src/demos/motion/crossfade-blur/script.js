// 押したら data-copied="true" にし、1.5秒後に戻す
for (const button of document.querySelectorAll('.scoped.copy-button')) {
  let timer;
  button.addEventListener('click', () => {
    button.dataset.copied = 'true';
    clearTimeout(timer);
    timer = setTimeout(() => {
      button.dataset.copied = 'false';
    }, 1500);
  });
}
