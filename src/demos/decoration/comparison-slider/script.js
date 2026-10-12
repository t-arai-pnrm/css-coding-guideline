const root = document.querySelector('.scoped.comparison-slider');
const range = root.querySelector('._range');

// 範囲の入力の値を、切り抜く位置のカスタムプロパティに書き込む
const update = () => {
  root.style.setProperty('--comparison-slider--position', `${range.value}%`);
};

range.addEventListener('input', update);

// 再読み込みでブラウザが入力の値を復元した場合にも合わせる
update();
