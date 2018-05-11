var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'assets');
var APP_DIR = path.resolve(__dirname, 'app');

var config = {
    entry: {
        'app': APP_DIR + '/app.js'
    },
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                query: {
                    presets: ['es2015',  'stage-0'],
                    plugins: ["transform-decorators-legacy"]
                }
            },
        ]
    },
    resolve: {
        modules: ['node_modules', '.'],
        extensions: ['.js', '.jsx']
    },
};

module.exports = config;