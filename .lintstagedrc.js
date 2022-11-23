module.exports = {
  '**/*.{js,jsx,ts,tsx,vue}': [
    'prettier --write',
    'eslint --ext .js,.jsx,.ts,.tsx,.vue --fix --ignore-path .gitignore',
  ],
}
