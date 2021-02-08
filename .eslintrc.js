module.exports = {
    root: true,
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 6,
        parser: 'babel-eslint'
    },
    parser: "vue-eslint-parser",
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    // add your custom rules here
    'rules': {
        // allow debugger during development
        // 'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-unused-vars': "off",
        'no-console': "off"
    }
}
