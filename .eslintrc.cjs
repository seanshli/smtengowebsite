/* eslint-env node */
// create-vue standard config. This repo shipped the eslint deps but never a config,
// so `npm run lint` parsed every file with espree and threw 113 "keyword reserved" errors.
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  parserOptions: { ecmaVersion: 'latest' },
  ignorePatterns: [
    'dist/', 'node_modules/', 'graphify-out/',
    'video/',            // separate Remotion sub-project with its own package.json/tsconfig
    'public/',           // shipped static assets, not source
  ],
  rules: {
    // Pages are named after routes (index.vue, product.vue); the multi-word rule is for component libraries.
    'vue/multi-word-component-names': 'off',
  },
}
