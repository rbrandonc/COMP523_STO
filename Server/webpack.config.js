var path = require("path");

var DIST_DIR   = path.join(__dirname, "dist"),
    CLIENT_DIR = path.join(__dirname, "src"),
    ENTRY = "./scripts/main";

console.log("webpack context: " + DIST_DIR + ENTRY);

module.exports = {
  context: DIST_DIR,
  target: 'web',
  entry: ENTRY,
  output: {
    path:     DIST_DIR,
    filename: "bundle.js"
  },
  resolve: {
    extensions: ['*', '.js'],
    alias: {
    	     Sprites: path.resolve(DIST_DIR, 'sprites/')
    }
  },
  module: {
  	loaders: [
          { test: /\.tmx$/, loader: "tmx-loader" }
  	]
  }
};
