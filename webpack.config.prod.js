import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
process.env.NODE_ENV = "production";
const config = require('config');
import path from 'path';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  __DEV__: false
};

const packinize = (obj) => {
  const ret = Object.assign({}, obj);

  (function pack(o) {
    Object.keys(o).forEach((key) => {
      const v = o[key];
      if (typeof v === 'string' || typeof v === 'boolean') {
        o[key] = JSON.stringify(v);
      } else if (
        (typeof v === 'object') &&
        (typeof v !== 'function')
      ) {
        pack(v);
      }
    });
  }(ret));

  return ret;
};

export default {
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json']
  },
  devtool: 'source-map', // more info:https://webpack.js.org/guides/production/#source-mapping and https://webpack.js.org/configuration/devtool/
  entry: [
    'babel-polyfill',
    './src/webpack-public-path',
    "./silent_renew/index.js",
    path.resolve(__dirname, 'src/index')
  ],
  target: 'web',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[contenthash].js'
  },
  plugins: [
    // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new webpack.DefinePlugin(GLOBALS),
    new webpack.DefinePlugin({
      __CONFIG__: packinize(config)
    }),
    new CopyWebpackPlugin([
      {from:'src/resources',to:'resources'},
      {from:'src/web.config'}
    ]),
    // Generate an external css file with a hash in the filename
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),

    // Generate HTML file that contains references to generated bundles. See here for how this works: https://github.com/ampedandwired/html-webpack-plugin#basic-usage
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      favicon: 'src/favicon.ico',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true,
      // Note that you can add custom options here if you need to handle other custom logic in index.html
      // To track JavaScript errors via TrackJS, sign up for a free trial at TrackJS.com and enter your token below.
      trackJSToken: ''
    }),
    new HtmlWebpackPlugin({
      template: "./silent_renew/silent_renew.html",
      chunks: ["silentRenew"],
      filename: "silent_renew.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'image/svg+xml',
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.less$/,
        loader: 'less-loader' // compiles Less to CSS
      },
      {
        test: /(\.css|\.scss|\.sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('cssnano'),
                require('autoprefixer'),
              ],
              sourceMap: true
            }
          }, {
            loader: 'sass-loader',
            options: {
              includePaths: [path.resolve(__dirname, 'src', 'scss')],
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
};
