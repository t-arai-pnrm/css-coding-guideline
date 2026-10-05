const form = document.querySelector('.scoped.profile-form');
const agree = form.querySelector('[name="agree"]');
const submit = form.querySelector('[type="submit"]');
const user = form.querySelector('[name="username"]');
const error = form.querySelector('._error');
const status = form.querySelector('._status');

// 同意するまでは aria-disabled で無効を伝える。フォーカスは残る
agree.addEventListener('change', () => {
  submit.setAttribute('aria-disabled', String(!agree.checked));
});

// aria-disabled は操作を止めないので、送信はスクリプトで止める
submit.addEventListener('click', (event) => {
  if (submit.getAttribute('aria-disabled') === 'true') {
    event.preventDefault();
    status.textContent = '利用規約に同意すると、登録できます。';
  }
});

form.addEventListener('submit', () => {
  status.textContent = '登録しました。';
});

// サーバーの検証で見つかったエラーは、aria-invalid で伝える
form.querySelector('._server').addEventListener('click', () => {
  user.setAttribute('aria-invalid', 'true');
  error.hidden = false;
});

// 入力し直したら、エラーの状態を外す
user.addEventListener('input', () => {
  user.removeAttribute('aria-invalid');
  error.hidden = true;
});
