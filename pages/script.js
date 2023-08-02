function init() {
  loadBinaryMessage();

  function loadBinaryMessage() {
    const string = 'True Love Will Find You in the End.';

    const binary = string
      .split('')
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'));

    const $message = document.querySelector('[data-message]');

    let play = true;

    $message.addEventListener('mouseenter', () => {
      play = false;
    });

    $message.addEventListener('mouseleave', () => {
      play = true;
    });

    let current = Number(localStorage.getItem('message-index')) ?? 0;

    $message.textContent = binary[current];

    setInterval(() => {
      if (!play) return;

      $message.textContent = binary[current];

      current++;

      if (current === binary.length) {
        current = 0;
      }

      localStorage.setItem('message-index', current);
    }, 2000);
  }
}
