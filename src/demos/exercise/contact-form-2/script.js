// 独自の誤りの文章を入力欄に関連付ける属性（aria-describedby、aria-invalid）を付ける。見た目は CSS の :user-invalid が受け持つ
for (const field of document.querySelectorAll('.contact-form ._field')) {
  const control = field.querySelector('input, select, textarea');
  const error = field.querySelector('._error');
  if (!control || !error) continue;

  const update = () => {
    const invalid = control.matches(':user-invalid');
    const ids = new Set((control.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean));
    if (invalid) ids.add(error.id);
    else ids.delete(error.id);
    control.setAttribute('aria-invalid', String(invalid));
    if (ids.size > 0) control.setAttribute('aria-describedby', [...ids].join(' '));
    else control.removeAttribute('aria-describedby');
  };

  control.addEventListener('blur', update);
  control.addEventListener('change', update);
  control.addEventListener('input', update);
  // 送信しようとして invalid になったあと、:user-invalid が当てはまってから読み直す
  control.addEventListener('invalid', () => requestAnimationFrame(update));
}
