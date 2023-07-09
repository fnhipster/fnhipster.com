const $soy = document.querySelector('#soy-form');

$soy.addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Submitted!');
});
