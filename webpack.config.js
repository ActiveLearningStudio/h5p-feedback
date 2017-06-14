const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const isProd = (process.env.NODE_ENV === 'production');

const extractSass = new ExtractTextPlugin({
  filename: "h5p-feedback.css"
});

const config = {
  entry: "./src/entries/dist.js",
  devtool:  isProd ? 'source-map' : 'inline-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "h5p-feedback.js",
    sourceMapFilename: '[file].map'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    },
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules'),
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          preserveWhitespace: false,
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [
            {
              loader: "css-loader?sourceMap"
            },
            {
              loader: "resolve-url-loader"
            },
            {
              loader: "sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true"
            }
          ],

          fallback: "style-loader"
        })
      },
      {
        test: /\.svg$/,
        include: path.join(__dirname, 'src/images'),
        loader: 'url-loader?limit=10000'
      } // inline base64 URLs for <=10k images, direct URLs for the rest
    ]
  },
  plugins: [
    extractSass,
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
};

module.exports = config;