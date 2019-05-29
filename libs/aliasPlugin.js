module.exports = {
  main: [
    {
      test: require.resolve('luck7/plugins'),
      loader: ['babel-loader?plugins[]=syntax-dynamic-import', 'luck7/libs/loader']
    }
  ],
  plugins: [
    {
      test: /luck7-ui.src.*?js$/,
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [[require.resolve('babel-preset-env'), {modules: false}]],
        plugins: [require.resolve('babel-plugin-transform-runtime')],
        comments: false
      }
    }
  ]
}
