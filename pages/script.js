function init() {
  addImageGlow();
  loadBinaryMessage();

  function addImageGlow() {
    const $images = document.querySelectorAll('.app__content img');

    $images.forEach(($image) => {
      const $original = $image.cloneNode(true);

      const $glow = $image.cloneNode(true);
      $glow.setAttribute('aria-hidden', true);

      const $wrapper = document.createElement('span');
      $wrapper.classList.add('app__content__img');
      $wrapper.appendChild($original);
      $wrapper.appendChild($glow);

      $image.replaceWith($wrapper);
    });
  }

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
