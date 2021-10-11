const fs = require("fs");
const packageJson = fs.readFileSync("./package.json");
const version = JSON.parse(packageJson).version || 0;

const webpack = require("webpack");

var scssPrependData = `
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixins.scss";
`;

if (process.env.NODE_ENV == "production") {
    scssPrependData += `
    @import "@/assets/scss/_theme.scss";
    `;
} else {
    scssPrependData += `
    @import "@/assets/scss/_devtheme.scss";
    `;
}

module.exports = {
    css: {
        loaderOptions: {
            sass: {
                prependData: scssPrependData,
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
