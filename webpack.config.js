var path = require('path');
var webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin')
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
        { test: /\.js$/, loader: 'babel-loader' },
    ].concat(vtkRules),    
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath,
    ],
  },
  plugins: [
    new CopyPlugin([
      {
      from: path.join(__dirname, 'node_modules', 'itk', 'WebWorkers'),
      to: path.join(__dirname, 'dist', 'itk', 'WebWorkers'),
      },
      {
      from: path.join(__dirname, 'node_modules', 'itk', 'ImageIOs'),
      to: path.join(__dirname, 'dist', 'itk', 'ImageIOs'),
      },
      {
      from: path.join(__dirname, 'node_modules', 'itk', 'MeshIOs'),
      to: path.join(__dirname, 'dist', 'itk', 'MeshIOs'),
      },
    ]),
  ],
  performance: {
      maxAssetSize: 10000000
  },
};