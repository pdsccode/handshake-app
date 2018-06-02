const path = require('path');

const xPath = filepath => path.resolve(__dirname, filepath);

// Webpack
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PwaManifestPlugin = require('webpack-pwa-manifest');
const OfflinePlugin = require('offline-plugin');


const dotenv = require('dotenv');

const stats = {
  modules: false,
  children: false,
  chunks: false,
};

const development = {
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    watchContentBase: true,
    stats,
    publicPath: '/',
    historyApiFallback: {
      disableDotRule: true,
    },
    hot: true,
    host: '0.0.0.0',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
};

const production = {
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
    noEmitOnErrors: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new OptimizeCSSAssetsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[hash].[name].css',
    }),
  ],
  performance: { hints: false },
};

module.exports = function webpackConfig(env, argv) {
  const isProduction = argv.mode === 'production';

  if (!isProduction) {
    dotenv.config();
  } else {
    // PUBLIC_PATH =
    dotenv.config({ path: xPath('.env.production') });
  }

  return merge(
    {
      entry: {
        main: xPath('src/index.js'),
        'app-sw': xPath('src/sw.js'),
      },
      output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[hash].[name].chunk.js',
        publicPath: '/',
        globalObject: 'this',
      },
      resolve: {
        alias: { '@': xPath('src') },
        extensions: ['.js', '.jsx', '.scss', '.css'],
        modules: [xPath('node_modules')],
      },
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(argv.mode),
          'process.env.isProduction': JSON.stringify(isProduction),
          'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
          'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL),
        }),
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
        }),
        new HtmlWebpackPlugin({
          chunks: ['main', 'vendors~main'],
          minify: isProduction
            ? {
              collapseWhitespace: true,
              preserveLineBreaks: true,
              removeComments: true,
            }
            : null,
          filename: 'index.html',
          template: xPath('src/templates/main.html'),
          favicon: xPath('src/assets/favicon.ico'),
        }),
        new PwaManifestPlugin({
          name: 'Handshake',
          short_name: 'Handshake',
          description: '',
          background_color: '#01579b',
          theme_color: '#01579b',
          'theme-color': '#01579b',
          start_url: '/',
          icons: [
            {
              src: xPath('src/assets/images/app/logo.png'),
              sizes: [96, 128, 192, 256, 384, 512],
              destination: path.join('assets', 'icons'),
            },
          ],
        }),
        new OfflinePlugin({
          publicPath: process.env.PUBLIC_URL,
          appShell: '/index.html',
        }),
      ],
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader',
                options: { minimize: isProduction },
              },
            ],
          },
          {
            test: /\.(raw)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: 'raw-loader',
          },
          {
            test: /\.(png|gif|jpe?g|svg|webp)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [
              'image-webpack-loader',
              {
                loader: 'file-loader',
                options: {
                  name: '[hash].[ext]',
                  outputPath: 'images/',
                  verbose: false,
                },
              },
            ],
          },
          {
            test: /\.(eot|tiff|woff2|woff|ttf|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[hash].[ext]',
                  outputPath: 'fonts/',
                  verbose: false,
                },
              },
            ],
          },
        ],
      },
      stats,
    },
    isProduction ? production : development,
  );
};
