const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { watchFile } = require("fs");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "main.js" ,
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    devtool: "eval-source-map",
    devServer: {
        watchFiles: ["./src/template.html"  ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html" ,
        }),
    ],
    module: {
        rules:[
            {
                test: /\.css$/i,
                use: ["style-loader" , "css-loader"],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.(png|gif|jpg|jpeg)$/i,
                type:"asset/resource",
            },
        ],
    },
};