const path = require('path');

module.exports = {
  entry: './app/javascript/index.jsx',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public'),
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
    contentBase: './public'
  }
};
