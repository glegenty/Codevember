const dev = process.env.NODE_ENV === 'dev'
const webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')

const parts = require('./webpack.parts')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')

let commonConfig = merge([
  {
    entry: parts.PATH.src,
    watch: true,
    output: {
      path: parts.PATH.dist,
      filename: dev ? 'bundle.js' : 'bundle.[chunkhash:8].js'
    },
    resolve: {
      alias: parts.PATH.alias
    },
    devtool: dev ? 'cheap-module-eval-source-map' : false,
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }]
    },
    plugins: [
      new webpack.ProvidePlugin({
        'THREE': 'three'
      }),
      new ExtractTextPlugin({
        filename: dev ? '[name].css' : '[name].[contenthash:8].css'
      }),
      new HtmlWebpackPlugin({
        template: './index.ejs'
      }),
      new CopyWebpackPlugin([
        {from: parts.PATH.fonts, to: 'static/fonts'}
      ])
    ]
  }
])

const prodConfig = merge([
  parts.extractCSS(),
  parts.loadFonts(),
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[ext]'
    }
  }),
  parts.loadShaders()
])

const devConfig = merge([
  // parts.loadCSS(),
  parts.extractCSS(),

  parts.loadFonts(),
  parts.loadImages(),
  parts.devServer(),
  parts.loadShaders()
])

if (!dev) {
  commonConfig.plugins.push(new CleanWebpackPlugin(['dist']))
  commonConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    })
  )
  commonConfig.plugins.push(new ManifestPlugin())
}

module.exports = () => {
  if (dev) {
    return merge(commonConfig, devConfig)
  }

  return merge(commonConfig, prodConfig)
}
