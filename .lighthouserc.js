module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      url: [process.env.URL],
      settings: {
        onlyCategories: [
          'performance',
          //   'accessibility',
          //   'best-practices',
          //   'seo',
        ],
      },
    },
  },

  assert: {
    assertions: {
      'categories:performance': [
        'error',
        { minScore: 0.9, aggregationMethod: 'median-run' },
      ],
      //   'categories:accessibility': [
      //     'error',
      //     { minScore: 1, aggregationMethod: 'pessimistic' },
      //   ],
      //   'categories:best-practices': [
      //     'error',
      //     { minScore: 1, aggregationMethod: 'pessimistic' },
      //   ],
      //   'categories:seo': [
      //     'error',
      //     { minScore: 1, aggregationMethod: 'pessimistic' },
      //   ],
    },
  },
};
