const path = require('path');

module.exports = {
  entry: './public/charts.js',
  output: {
    filename: 'chart_main.js',
    path: path.resolve(__dirname, 'public'),
  }
};
