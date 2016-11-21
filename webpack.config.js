const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const cssnext = require('postcss-cssnext')

/**
 * Webpack plugins, depending on commandline flags.
 * @return Array
 */
function getPlugins ({debug, minify}) {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(minify ? 'production' : 'development')
    }),
    new webpack.LoaderOptionsPlugin({
      debug,
      minimize: minify,
      options: {
        context: __dirname,
        postcss: [
          cssnext({
            browsers: ['last 2 version', 'ie >= 11']
          })
        ]
      }
    }),
    new ExtractTextPlugin(minify ? '[name].min.css' : '[name].css')
  ]

  if (minify) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        },
        output: {
          comments: false
        }
      })
    )
  }

  plugins.push(
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'src/index.html')
    })
  )

  /**
   * Consider plugins such as webpack.optimize.AggressiveMergingPlugin
   * and CommonsChunkPlugin with when using big third-party libaries
   */

  return plugins
}

/**
 * Generates a Webpack config.
 * @param  {Boolean} options.debug
 * @param  {Boolean} options.minify
 * @return {Object}
 */
module.exports = ({debug = false, minify = false} = {}) => ({
  target: 'web',
  devtool: 'source-map',
  entry: './src/main.js',
  output: {
    publicPath: '',
    filename: 'main.min.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: getPlugins({debug, minify}),
  module: {
    loaders: [

      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel-loader'
      },

      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            {
              loader: 'css-loader',
              query: {
                modules: true
              }
            },
            'postcss-loader'
          ]
        })
      },

      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: [
          {
            loader: 'url-loader',
            query: {
              limit: 2000,
              name: 'assets/[name].[ext]'
            }
          }
        ]
      },

      {
        test: /\.(ico|woff)$/,
        loader: [
          {
            loader: 'url-loader',
            query: {
              limit: 1,
              name: 'assets/[name].[ext]'
            }
          }
        ]
      }

    ]
  }
})
