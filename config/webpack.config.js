const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const PACKAGE = require('../package.json');

const TerserPlugin = require('terser-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExcludeAssetsPlugin = require('@ianwalter/exclude-assets-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const mkdirp = require('mkdirp');

const Targets = {
  CLIENT: 'client',
  SERVER: 'server',
};

const getTarget = (target) => {
  switch (target) {
    case Targets.CLIENT:
      return 'web';
    case Targets.SERVER:
      return 'node';
  }
};

const getOutputPath = (target) => {
  switch (target) {
    case Targets.CLIENT:
      return path.resolve(__dirname, '../build/static');
    case Targets.SERVER:
      return path.resolve(__dirname, '../build/server');
  }
};

function getPublicPath(target, mode) {
  if (mode === 'deployment') {
    switch (target) {
      case Targets.CLIENT:
      case Targets.SERVER:
        return 'https://facebook-developer-circle-moscow.github.io/CasualChat/static/';
    }
  } else {
    switch (target) {
      case Targets.CLIENT:
      case Targets.SERVER:
        return '/static/';
    }
  }
}

const getEntry = (target) => {
  switch (target) {
    case Targets.CLIENT:
      return {
        index: './src/client.tsx',

        inline: [
          './src/scss/inline.scss',
          './src/inline.ts'
        ]
      };
    case Targets.SERVER:
      return {
        index: './src/server.tsx',
        router: './src/routers/index.tsx',
        store: './src/store/index.ts'
      };
  }
};

module.exports = (target, mode) => {
  const isDeployment = mode === 'deployment';
  const isDevelopment = !isDeployment && mode === 'development';
  const isProduction = isDeployment || mode === 'production';

  const isClient = target === Targets.CLIENT;
  const isServer = target === Targets.SERVER;

  const postcss = {
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        minimize: isProduction,
        ident: 'postcss',
        plugins: [
          'postcss-flexbugs-fixes',
          'postcss-normalize',
          'autoprefixer'
        ]
      },
      sourceMap: isDevelopment
    }
  };

  const css = {
    loader: require.resolve('css-loader'),
    options: {
      sourceMap: isDevelopment
    }
  };

  const image = {
    loader: ImageMinimizerPlugin.loader,
    options: {
      minimizerOptions: {
        plugins: [
          ['gifsicle', {interlaced: true}],
          ['jpegtran', {progressive: true}],
          ['optipng', {optimizationLevel: 5}],
          ['svgo', {plugins: [{removeViewBox: false}]}],
        ],
      },
    },
  };

  return {
    mode: isDevelopment ? 'development' : 'production',
    target: getTarget(target),
    externals: isServer ? [
      nodeExternals(),
      path.resolve(__dirname, '../build')
    ] : [],
    cache: isDevelopment,
    bail: isProduction,
    devtool: isDevelopment ? 'source-map' : undefined,
    entry: getEntry(target),
    stats: {
      children: true,
      errorDetails: true
    },
    node: {
      __dirname: false,
      __filename: false
    },
    output: {
      path: getOutputPath(target),
      publicPath: getPublicPath(target, mode),

      filename: '[name].js',
      chunkFilename: '[name].js',

      library: {
        name: PACKAGE.name,
        type: 'umd'
      }
    },
    resolve: {
      modules: [
        'node_modules',
        path.resolve(__dirname, '../src')
      ],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: [
            'babel-loader'
          ],
          include: path.resolve(__dirname, '../src')
        },
        {
          test: /\.(ts|tsx)$/,
          use: [
            'ts-loader'
          ],
          include: path.resolve(__dirname, '../src')
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            css,
            postcss
          ]
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            css,
            postcss,
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: [
                    path.resolve(__dirname, '../src'),
                  ],
                  minimize: isProduction
                },
                sourceMap: isDevelopment
              }
            }
          ]
        },
        {
          test: /images\/.*\.(jpe?g|png|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10 * 1024
              }
            },
            image
          ]
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                extract: true
              }
            },
            image
          ],
          exclude: /fonts\/.*\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/
        }
      ]
    },
    plugins: [
      ...(!isDeployment ? [new webpack.ProgressPlugin()] : []),
      ...(
          isClient ? [
            new HtmlWebpackPlugin({
              filename: 'index.html',
              template: 'public/index.html',
              excludeAssets: [
                /inline.(css|js)/
              ]
            }),
            new ExcludeAssetsPlugin(),
          ] : []
      ),
      new webpack.DefinePlugin({
        name: JSON.stringify(PACKAGE.name),
        version: JSON.stringify(PACKAGE.version),
        target: JSON.stringify(target),
        mode: JSON.stringify(mode),
        'process.env.NODE_ENV': JSON.stringify(
            mode === 'deployment' ? 'production' : mode),
      }),
      new SpriteLoaderPlugin({
        plainSprite: true
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../public/favicons'),
            to: path.resolve(__dirname, '../build/favicons')
          }
        ]
      }),
      {
        apply: (compiler) => {
          if (isDeployment && isServer) {
            compiler.hooks.afterEmit.tapPromise('done', () => {
              const {ssr} = require('../scripts/ssr');

              const urls = ['/', '*'];

              const STATIC = path.resolve(__dirname + '/../build');

              return Promise.all(urls.map((url) => new Promise((resolve) => {
                ssr(url).then((html) => {
                  const outFile = url !== '*' ? path.join(STATIC, url, 'index.html') : path.join(STATIC, '/404.html');

                  mkdirp.sync(path.dirname(outFile));

                  fs.writeFileSync(outFile, html);

                  resolve();
                }).catch(resolve);
              })));
            });
          }
        }
      }
    ],
    optimization: {
      minimize: isClient && isProduction,
      minimizer: [new TerserPlugin()],
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              // TODO add version
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      }
    },
    performance: {
      hints: !isDeployment && isProduction ? 'warning' : false
    }
  };
};