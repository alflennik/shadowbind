const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'shadowbind.js',
    path: path.resolve(__dirname, 'dist')
  }
}
