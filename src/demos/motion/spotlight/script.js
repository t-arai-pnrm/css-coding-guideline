const spotlight = document.querySelector('.scoped.spotlight');
let rect = null;

// スクロールやリサイズで位置が変わったら、測った値を捨てる
const clearRect = () => {
  rect = null;
};
document.addEventListener('scroll', clearRect, { capture: true, passive: true });
window.addEventListener('resize', clearRect);

spotlight.addEventListener('pointermove', (event) => {
  rect ??= spotlight.getBoundingClientRect();
  spotlight.style.setProperty('--spotlight--x', `${event.clientX - rect.left}px`);
  spotlight.style.setProperty('--spotlight--y', `${event.clientY - rect.top}px`);
});
