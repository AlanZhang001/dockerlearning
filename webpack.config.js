let buildConfig = {};
var extend = require('extend');
var path = require('path');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// 公共的配置
let commonConfig = {
    entry: {
        index: './es5/index.js'
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'text-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }]
    },
    externals: {
        angular: 'angular',
        jquery: 'jQuery',
        underscore: '_',
        zepto: 'Zepto'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: '[name]'
    },
    watch: false,
    devtool: ''
};

buildConfig['build-es5'] = extend(true,{},commonConfig,{
    output: {
        filename: '[name].es5.js'
    }
});

buildConfig['build-es5-min'] = extend(true,{},commonConfig,{
    output: {
        filename: '[name].es5.min.js'
    },
    plugins:[
        new UglifyJsPlugin()
    ],
});

buildConfig['build-es6'] = extend(true,{},commonConfig,{
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: '[name].es6.js'
    }
});

buildConfig['build-es6-min'] = extend(true,{},commonConfig,{
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: '[name].es6.min.js'
    },
    plugins:[
        new UglifyJsPlugin()
    ]
});

module.exports = env => {
    let currentType = env.NODE_ENV;
    return buildConfig[currentType];
};
