const path = require('path')
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'shadowbind.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'shadowbind',
    libraryTarget: 'umd'
  },
  plugins: [
    // new UglifyJSPlugin()
  ]
}
