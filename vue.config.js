const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    configureWebpack: {
        devServer: {
            webSocketServer: false,
        }
    },
    transpileDependencies: true
})
