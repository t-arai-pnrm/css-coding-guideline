const template = document.querySelector('#theme-toggle-template');
const meta = document.querySelector('meta[name="color-scheme"]');

class ThemeToggle extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    this.attachShadow({ mode: 'open' }).append(template.content.cloneNode(true));

    // 選んだ配色を、ページの meta 要素の content に反映する
    for (const radio of this.shadowRoot.querySelectorAll('input[type="radio"]')) {
      radio.checked = radio.value === meta.content;
      radio.addEventListener('change', () => {
        meta.content = radio.value;
      });
    }
  }
}

customElements.define('theme-toggle', ThemeToggle);
