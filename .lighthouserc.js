module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      url: ['http://localhost:8080/'],
      startServerCommand: 'deno task build && deno task start',
      upload: {
        target: 'temporary-public-storage',
      },
    },
  },
};
