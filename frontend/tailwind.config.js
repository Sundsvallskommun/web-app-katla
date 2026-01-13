/* eslint-disable @typescript-eslint/no-require-imports */
module.exports = {
  content: [
    './src/app/**/*.tsx',
    './src/components/**/*.tsx',
    './src/layouts/**/*.tsx',
    './src/services/**/*.tsx',
    './node_modules/@sk-web-gui/*/dist/**/*.js',
  ],
  theme: {
    // extend: {

    // }
  },
  darkMode: 'class', // or 'media' or 'class'
  presets: [require('@sk-web-gui/core').preset()],
  // plugins: [require('@tailwindcss/forms'), require('@sk-web-gui/core')],
};
