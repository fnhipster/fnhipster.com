import { createState, getPageScope } from '/scripts/mdly.js';

const scope = getPageScope('pure-html');

const state = createState(
  {
    one: 'one',
    two: 'two',
  },
  scope
);

// Form
const $form = scope.querySelector('form');

$form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  state.one = data.one;
  state.two = data.two;
});
