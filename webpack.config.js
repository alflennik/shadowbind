const path = require('path')

module.exports = {
  entry: './spec/src/index.js',
  output: {
    filename: 'index.js', path: path.resolve(__dirname, 'spec', 'dist')
  }
}
