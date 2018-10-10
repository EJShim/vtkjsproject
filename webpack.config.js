var path = require('path');
var webpack = require('webpack');
var vtkRules = require('vtk.js/Utilities/config/dependency.js').webpack.v2.rules;

// var entry = path.join(__dirname, './src/main.js');
const sourcePath = path.join(__dirname, './src');
const outputPath = path.join(__dirname, './dist');

module.exports = {
  entry:path.join(__dirname, './src/main.js'),
  output: {
    path: outputPath,
    filename: 'bundle.js',
  },
  module: {
    rules: [
        { test: path.join(__dirname, './src/main.js'), loader: "expose-loader?bundle" },
        { test: /\.html$/, loader: 'html-loader' },        
    ].concat(vtkRules),    
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath,
    ],
  },
};