const path = require('node:path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.resolve(__dirname, 'src');

module.exports = {
  entry: path.resolve(__dirname, 'index.web.tsx'),

  output: {
    path: path.resolve(__dirname, 'dist-web'),
    filename: 'bundle.js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.json'],
    mainFields: ['browser', 'module', 'main'],
    alias: {
      'react-native$': 'react-native-web',
      '@': src,
      '@op-engineering/op-sqlite': path.resolve(__dirname, 'src/db/op-sqlite.web.ts'),
      'drizzle-orm/op-sqlite': path.resolve(__dirname, 'src/db/drizzle-op-sqlite.web.ts'),
      // react-native-vector-icons shim (all import paths react-native-paper tries)
      'react-native-vector-icons': path.resolve(__dirname, 'src/web-shims/react-native-vector-icons.web.tsx'),
      'react-native-vector-icons/MaterialCommunityIcons': path.resolve(__dirname, 'src/web-shims/react-native-vector-icons.web.tsx'),
      '@react-native-vector-icons/material-design-icons': path.resolve(__dirname, 'src/web-shims/react-native-vector-icons.web.tsx'),
      '@expo/vector-icons/MaterialCommunityIcons': path.resolve(__dirname, 'src/web-shims/react-native-vector-icons.web.tsx'),
      '@expo/vector-icons': path.resolve(__dirname, 'src/web-shims/react-native-vector-icons.web.tsx'),
    },
  },

  module: {
    rules: [
      // Fix: webpack 5 ESM fullySpecified issue across navigation packages
      {
        test: /\.m?js$/,
        resolve: { fullySpecified: false },
        include: /node_modules/,
      },
      // Transpile TS/TSX/JSX from app and monorepo shared package
      {
        test: /\.(tsx?|jsx?)$/,
        use: {
          loader: 'babel-loader',
          options: {
            sourceType: 'unambiguous',
            presets: [
              ['@react-native/babel-preset', { useTransformReactJSXSource: false }],
            ],
            plugins: [
              ['module-resolver', {
                root: [src],
                alias: { '@': src },
                extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.jsx', '.js'],
              }],
              'react-native-reanimated/plugin',
            ],
          },
        },
        include: [
          src,
          path.resolve(__dirname, '../../packages/shared/src'),
          path.resolve(__dirname, '../../node_modules/react-native-reanimated'),
          path.resolve(__dirname, 'node_modules/react-native-reanimated'),
          // Ensure all node_modules starting with react-native- are considered for transpilation if they provide ESM
          /[\\/]node_modules[\\/]react-native-/,
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    // Silence react-native-paper's icon subpath import — native-only, no-op on web
    new webpack.NormalModuleReplacementPlugin(
      /react-native-vector-icons[\/\\]MaterialCommunityIcons/,
      path.resolve(__dirname, 'src/web-shims/react-native-vector-icons.web.tsx'),
    ),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
  ],

  devServer: {
    host: '0.0.0.0',
    port: 8081,
    hot: true,
    historyApiFallback: true,
    client: { overlay: { errors: true, warnings: false } },
  },

  // Prevent watchpack ENOTDIR crash when a .web.tsx file is mistaken for a dir
  watchOptions: {
    ignored: /node_modules/,
  },

  devtool: 'eval-cheap-source-map',
};
