const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'web',
    externals: [nodeExternals()],
    resolve: {
        fallback: {
            "zlib": false,
            "path": require.resolve("path-browserify"),
            "buffer": require.resolve("buffer/"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "http": require.resolve("stream-http"),
            "util": require.resolve("util/"),
            "net": false
        }
    },
    entry: ['./src/client/index.js'],
    mode: 'development',
    devtool: 'source-map',
    stats: 'verbose',
    devServer: {
      port:9000
    },
    output: {
      path: path.resolve(process.cwd(), 'dist'),
      libraryTarget: 'var',
      library: 'Client'
    },
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(scss|css)$/,
                use: [ 'style-loader', 'css-loader',
                   // {loader: 'sass-loader',
                   //  options: {
                   //    sassOptions: {
                   //      includePaths: ["./styles/style.css"],
                   //    },
                   //  },
                   // },
                'sass-loader'],
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: false,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        })
        ,new WorkboxPlugin.GenerateSW()
    ]
};
