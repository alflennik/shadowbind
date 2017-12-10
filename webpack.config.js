const path = require('path')

module.exports = {
  entry: {
    tests: './spec/src/components.js',
    shadowbind: './src/index.js'
  },
  output: {
    filename: '[name].js', path: path.resolve(__dirname, 'dist')
  }
}
