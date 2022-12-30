module.exports = {
    plugins: [
        {
            plugin: require('craco-plugin-scoped-css')
        }
    ],

    devServer: {
        port: 5000,
        proxy: {
            '/api': {
                target: 'http://[::1]:5000'
            }
        }
    }
}
