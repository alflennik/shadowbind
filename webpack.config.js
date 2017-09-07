const path = require('path')

module.exports = {
  entry: './spec/src/components.js',
  output: {
    filename: 'components.js', path: path.resolve(__dirname, 'spec', 'dist')
  }
}
