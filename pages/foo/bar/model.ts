export default () => {
  return {
    meta: {
      title: 'Bar ' + new Date().toISOString(),
      date: '2021-05-02',
      description: "I'm a bar!",
    },

    name: 'Carlos',
    time: new Date().toISOString(),

    method: () => 'one',

    deep: {
      in: {
        sea: true,
        deeper: false,
      },
    },
  };
};
