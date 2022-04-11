module.exports = {
    plugins: [
        {
            plugin: require('craco-plugin-scoped-css')
        }
    ],

    devServer: {
        proxy: {
            '/api': {
                target: 'http://[::1]:5000'
            }
        }
    }
}
