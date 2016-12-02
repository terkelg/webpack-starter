const webpack = require('webpack')
const {resolve} = require('path')
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
      debug: false,
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
          screw_ie8: true,
          warnings: false
        },
        output: {
          comments: false
        }
      })
    )
  }

  /* uncomment if using mutiple entry points
  if (minify) {
    plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      })
    )
  }
  */

  plugins.push(
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve(__dirname, 'src/index.html'),
      minify: minify ? {
        removeComments: true,
        collapseWhitespace: true
      } : false
    })
  )

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
  entry: './src/app.js',
  output: {
    publicPath: '',
    filename: 'bundle.[chunkhash].js',
    path: resolve(__dirname, 'dist')
  },
  plugins: getPlugins({debug, minify}),
  module: {
    loaders: [
      {test: /\.js$/, include: /src/, loader: 'babel-loader'},
      {test: /\.css|\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader?sourceMap!postcss-loader!sass-loader?sourceMap'
        })
      },
      {test: /\.svg(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=assets/[name].[ext]'},
      {test: /\.(jpe?g|png|gif|svg)$/, loader: 'url-loader?limit=2000&name=assets/[name].[ext]'},
      {test: /\.(ico|woff)$/, loader: 'url-loader?limit=1&name=assets/[name].[ext]'},
      {test: /\.json$/, loader: 'json-loader'}
    ]
  }
})
