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
    // if you want to override max content width
    // maxWidth: {
    //   content: screens['desktop-max'], // default in core is based on screens
    // },
  },
  darkMode: 'class', // or 'media' or 'class'
  presets: [require('@sk-web-gui/core').preset()],
  // plugins: [require('@tailwindcss/forms'), require('@sk-web-gui/core')],
};
