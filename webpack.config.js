const path = require('path');

module.exports = {
  entry: './content.js', // Your content.js file
  output: {
    filename: 'content.bundle.js',
    path: path.resolve(__dirname), // Output directory
  },
  mode: 'production',
};
