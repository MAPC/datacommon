const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },
  entry: './app/javascript/index.jsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: "[name].[contenthash].js",
    chunkFilename: 'chunks/[name].[chunkhash].js',
    assetModuleFilename: 'media/[name][hash][ext][query]'
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'] },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: 8192
        },
      },
      {
         test:/\.(s*)css$/,
         use:['style-loader','css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    contentBase: './public',
    historyApiFallback: true
  }
};
