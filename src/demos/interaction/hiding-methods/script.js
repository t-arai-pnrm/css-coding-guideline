const root = document.querySelector('.hiding-methods');
const target = root.querySelector('._target');

// 選んだ隠し方だけを「隠すリンク」に適用し、ほかの隠し方は外す
root.addEventListener('change', (event) => {
  const method = event.target.value;
  target.hidden = method === 'hidden';
  target.inert = method === 'inert';
  target.classList.toggle('-visually-hidden', method === 'visually-hidden');
  target.toggleAttribute('aria-hidden', method === 'aria-hidden');
  if (method === 'aria-hidden') target.setAttribute('aria-hidden', 'true');
  target.dataset.hiding = method;
});
