// command 属性と commandfor 属性に対応していないブラウザでは、メニューのボタンでドロワーを開けるようにポリフィルを読み込む
if (!('command' in HTMLButtonElement.prototype)) {
  import('https://cdn.jsdelivr.net/npm/invokers-polyfill@1.0.4/invoker.min.js');
}
