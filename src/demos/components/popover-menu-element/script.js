const CLOSE_DELAY = 300;

// ホバーで開く処理。ボタンとメニューの間の隙間を通る間に閉じないよう、閉じるのを少し遅らせる
const addHover = (button, menu, signal) => {
  let openedByHover = false;
  let closeTimer;

  const open = (event) => {
    if (event.pointerType === 'touch') return;
    clearTimeout(closeTimer);
    if (menu.matches(':popover-open')) return;
    // popovertarget を通して開くと、ボタンがメニューのアンカーになる
    button.click();
    openedByHover = true;
  };

  const close = (event) => {
    if (event.pointerType === 'touch' || !openedByHover) return;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if (menu.matches(':popover-open')) menu.hidePopover();
    }, CLOSE_DELAY);
  };

  for (const target of [button, menu]) {
    target.addEventListener('pointerenter', open, { signal });
    target.addEventListener('pointerleave', close, { signal });
  }

  // ホバーで開いたあとにボタンを押したら、閉じずに開いたままにする
  button.addEventListener(
    'click',
    (event) => {
      if (!event.isTrusted || !openedByHover) return;
      event.preventDefault();
      openedByHover = false;
    },
    { signal },
  );

  menu.addEventListener(
    'toggle',
    (event) => {
      if (event.newState !== 'closed') return;
      openedByHover = false;
      clearTimeout(closeTimer);
    },
    { signal },
  );
};

class PopoverMenu extends HTMLElement {
  #controller;

  connectedCallback() {
    const button = this.querySelector('[popovertarget]');
    const menu = this.querySelector('[popover]');
    if (!button || !menu) return;

    this.#controller = new AbortController();
    const { signal } = this.#controller;

    // hoverable 属性があり、ホバーできる環境のときだけ、ホバーで開く処理を足す
    if (this.hasAttribute('hoverable') && matchMedia('(any-hover: hover)').matches) {
      addHover(button, menu, signal);
    }

    // フォーカスが部品の外に出たら、メニューを閉じる
    this.addEventListener(
      'focusout',
      (event) => {
        if (this.contains(event.relatedTarget)) return;
        if (menu.matches(':popover-open')) menu.hidePopover();
      },
      { signal },
    );
  }

  disconnectedCallback() {
    this.#controller?.abort();
  }
}

customElements.define('popover-menu', PopoverMenu);
