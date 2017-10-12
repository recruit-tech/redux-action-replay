const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = (dirname, port) => {
  return {
    entry: [dirname + '/index.js'],
    output: {
      filename: 'index.bundle.js',
      path: dirname,
      publicPath: '/'
    },
    resolve: {
      alias: {
        'redux-action-replay': path.join(__dirname, '../src/index')
      }
    },
    devServer: {
      contentBase: '/',
      historyApiFallback: true,
      port
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['flow', 'react', ['env', { targets: { chrome: 61 } }]],
              plugins: ['transform-object-rest-spread']
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        )
      })
    ]
  }
}
