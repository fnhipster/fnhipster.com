function init() {
  loadBinaryMessage();

  function loadBinaryMessage() {
    const string = 'True Love Will Find You in the End';

    const binary = string
      .split('')
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'));

    binary.push('0x03');

    const $message = document.querySelector('[data-message]');

    let current = Number(localStorage.getItem('message-index')) ?? 0;

    $message.textContent = binary[current];

    const interval = setInterval(() => {
      $message.textContent = binary[current];

      current++;

      if (current === binary.length) {
        clearInterval(interval);
        current = 0;
      }

      localStorage.setItem('message-index', current);
    }, 2000);
  }
}
