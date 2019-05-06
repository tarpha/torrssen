module.exports = {
  root: true,
  //parser: 'babel-eslint',
  parser: "vue-eslint-parser",
  env: {
    browser: true,
    node: true
  },
  extends: [
    //'standard',
    'plugin:vue/recommended'
  ],
  // required to lint *.vue files
  //plugins: [
  //  'html'
  //],
  // add your custom rules here
  rules: {},
  globals: {}
}
