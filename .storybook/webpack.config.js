// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

module.exports = {
  plugins: [
    // your custom plugins
  ],
  module: {
    rules: [
      // add your custom rules.
      // {
      //   test: /\.ts[x]?$/,
      //   exclude: /(node_modules)/,
      //   loader: 'babel-loader?cacheDirectory!awesome-typescript-loader'
      // },
      {
        test: /\.js[x]?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader?cacheDirectory'
      },
      {
        test: /\.(css)$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules)/,
        loader: 'style-loader!css-loader?importLoaders=1!postcss-loader!sass-loader'
      }
    ],
  },
};
