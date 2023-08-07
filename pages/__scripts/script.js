const $scope = document.querySelector('[data-scope="app"]');

addImageGlow();
loadBinaryMessage();

function addImageGlow() {
  const $images = $scope.querySelectorAll('.app__content img');

  $images.forEach(($image) => {
    // Original
    const $original = $image.cloneNode(true);

    // Glow backdrop
    const $glow = $image.cloneNode(true);
    $glow.setAttribute('aria-hidden', true);

    // Add glow
    const $wrapper = document.createElement('span');
    $wrapper.classList.add('app__content__img');
    $wrapper.appendChild($original);
    $wrapper.appendChild($glow);

    $image.replaceWith($wrapper);
  });
}

function loadBinaryMessage() {
  const $message = $scope.querySelector('.app__message');

  const string = 'True Love Will Find You in the End.';

  const binary = string
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'));

  let play = false;

  let current = Number(localStorage.getItem('message-index')) ?? 0;

  $message.textContent = binary[current];

  // Play message
  setInterval(() => {
    if (!play) return;

    $message.textContent = binary[current];

    current++;

    if (current === binary.length) {
      current = 0;
    }

    localStorage.setItem('message-index', current);
  }, 2000);

  // Only play when if in view
  new IntersectionObserver((entries) => {
    play = entries[0].isIntersecting;
  }).observe($message);

  // Pause when hovered
  $message.addEventListener('mouseenter', () => {
    play = false;
  });

  // Resume when not hovered
  $message.addEventListener('mouseleave', () => {
    play = true;
  });
}
