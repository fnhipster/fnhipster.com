function init(page, { createState }) {
  const state = createState({
    count: 0,
  });

  const $button = page.querySelector('#count');

  $button.addEventListener('click', () => {
    state.count += 1;
  });
}
