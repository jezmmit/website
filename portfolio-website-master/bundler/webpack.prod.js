const path = require('path');
const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(
    commonConfiguration,
    {
        mode: 'production',
        output: {
            path: path.resolve(__dirname, '../dist'), // Output to /dist at root
            filename: '[name].[contenthash].js',
            publicPath: '' // Or '/your-repo-name/' if deploying to subpath
        },
        plugins: [
            new CleanWebpackPlugin()
        ]
    }
);