export default () => {
  return {
    meta: {
      title: 'Bar ' + new Date().toISOString(),
      published: true,
      date: '2021-05-02',
      description: "I'm a bar!",
    },
  };
};
