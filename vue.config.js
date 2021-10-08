const fs = require("fs");
const packageJson = fs.readFileSync("./package.json");
const version = JSON.parse(packageJson).version || 0;

const webpack = require("webpack");

module.exports = {
    css: {
        loaderOptions: {
            sass: {
                prependData: `
                    @import "@/assets/scss/_variables.scss";
                    @import "@/assets/scss/_mixins.scss";
                `,
            },
        },
    },
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                "process.env": {
                    PACKAGE_VERSION: '"' + version + '"',
                },
            }),
        ],
    },
};
