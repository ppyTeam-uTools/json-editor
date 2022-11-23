require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,

  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },

  extends: [
    'plugin:vue/vue3-essential',
    '@ttionya/eslint-config',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
}
