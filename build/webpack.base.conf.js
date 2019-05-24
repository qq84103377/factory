var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
require("babel-polyfill"); //es6

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: ['babel-polyfill', './src/main.js']
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath :process.env.NODE_ENV === 'preprd'?
                config.preprd.assetsPublicPath:process.env.NODE_ENV === 'strtest'?
                    config.strtest.assetsPublicPath:process.env.NODE_ENV ==='sevenGB'?
                        config.sevenGB.assetsPublicPath:process.env.NODE_ENV ==='SGBPRE'?
                        config.SGBPRE.assetsPublicPath:process.env.NODE_ENV ==='yl'?
                        config.yl.assetsPublicPath:process.env.NODE_ENV ==='mny'?
                        config.mny.assetsPublicPath:process.env.NODE_ENV ==='wsn'?
                        config.wsn.assetsPublicPath:config.dev.assetsPublicPath
    },
    externals: {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'axios': 'axios'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'scss_vars': '@/styles/vars.scss'
        }
    },
    module: {
        noParse: /node_modules\/(jquey|moment|chart\.js)/,
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory',
                include: [resolve('src'), resolve('test')],
                exclude:/node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    }
}
