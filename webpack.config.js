const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');


module.exports = {
    entry: [
        './Javascript/Nodejs/googleParse/express/public/javascripts/main.js',
        './Javascript/Nodejs/googleParse/express/public/stylesheets/style.scss',
    ],
    output: {
        path: path.join(__dirname, 'Javascript/Nodejs/googleParse/express/public/javascripts'),
        publicPath: '/',
        filename: 'scripts-bundled.js'
    },
    target: 'web',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                // Transpiles ES6-8 into ES5
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(sass|scss)$/,
                include: path.resolve(__dirname, "Javascript/Nodejs/googleParse/express/public/stylesheets"),
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {}
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            url: false
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            sourceMap: true,
                            plugins: () => [
                                require("cssnano")({
                                    preset: [
                                        "default",
                                        {
                                            discardComments: {
                                                removeAll: true
                                            }
                                        }
                                    ]
                                })
                            ]
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                // Loads the javacript into html template provided.
                // Entry point is set below in HtmlWebPackPlugin in Plugins
                // test: /\.html$/,
                // use: [{loader: "html-loader"}]
            }
        ]
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        // poll: 1000
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "../stylesheets/style-bundled.css"
        }),
        new VueLoaderPlugin()
        // new ExtractTextPlugin('./Javascript/Nodejs/googleParse/express/public/stylesheets/style.css')
        // new HtmlWebPackPlugin({
        //     template: "./index.html",
        //     filename: "./index.html",
        //     excludeChunks: [ 'server' ]
        // })
    ]
}
