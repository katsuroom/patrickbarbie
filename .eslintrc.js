module.exports = {
    extends: 'eslint:recommended',
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    env: {
      browser: true,
      es6: true,
      jest: true, // Include Jest testing environment
    },
    rules: {
      // Add or customize rules here
    },
  };
  