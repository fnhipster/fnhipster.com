function init(page, { createState }) {
  const state = createState({
    one: 'one',
    two: 'two',
  });

  // Form
  const $form = page.querySelector('form');

  $form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    state.one = data.one;
    state.two = data.two;
  });
}
