module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      url: [process.env.URL],
      upload: {
        target: 'temporary-public-storage',
      },
    },
  },
};
