const meta = document.querySelector('meta[name="color-scheme"]');

for (const radio of document.querySelectorAll('input[name="color-scheme"]')) {
  // いまの meta 要素の値に合わせて、最初の選択を決める
  radio.checked = radio.value === meta.content;

  // 選んだテーマを、meta 要素の content に書き込む
  radio.addEventListener('change', () => {
    meta.content = radio.value;
  });
}
