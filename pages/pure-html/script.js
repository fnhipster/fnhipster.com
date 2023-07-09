const $bindings = document.querySelectorAll('[data-binding]');

const initialState = {
  one: 'one',
  two: 'two',
};

const state = new Proxy(initialState, {
  set: (target, key, value) => {
    target[key] = value;

    Array.from($bindings).find((node) => {
      return node.dataset.binding === key;
    }).textContent = value;

    return true;
  },
});

// Initial bindings
$bindings.forEach(($binding) => {
  const key = $binding.dataset.binding;
  $binding.textContent = state[key];
});

// Form
const $form = document.querySelector('form');

$form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  state.one = data.one;
  state.two = data.two;
});
