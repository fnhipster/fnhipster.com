import { createState, getPageScope } from '/scripts/mdly.js';

const scope = getPageScope('/');

console.log(scope);

const state = createState(
  {
    count: 0,
  },
  scope
);

const $button = scope.querySelector('#count');

$button.addEventListener('click', () => {
  state.count += 1;
});
