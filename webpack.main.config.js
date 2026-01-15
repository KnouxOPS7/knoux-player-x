const path = require('path');

module.exports = {
  entry: './desktop/main/main.ts',
  target: 'electron-main', // This is CRITICAL
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: { "@desktop": path.resolve(__dirname, "desktop") }
  },
};