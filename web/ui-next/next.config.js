/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV !== "production"
const rewritesConfig = isDevelopment
    ? [
        {
            source: "/api/:path*",
            destination: "http://localhost:5000/api/:path*"
        }
    ]
    : []

const nextConfig = {
    reactStrictMode: true,
    rewrites: async () => rewritesConfig,

    eslint: {
        ignoreDuringBuilds: true
    },

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
                    { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
                    { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' }
                ]
            }
        ]
    },

    webpack(config, { isServer }) {
        config.module.rules.push({
            test: /\.wasm$/,
            use: ['wasm-loader'],
        })

        config.module.rules.push({
            test: /\.mp3$/,
            use: {
                loader: 'file-loader',
            }
        })
        
        //config.experiments = { asyncWebAssembly: true, syncWebAssembly: true };
        //config.resolve.alias.vscode = require.resolve('monaco-languageclient/node_modules/vscode')

        return config
    }
}

const removeImports = require('next-remove-imports')({
    test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
    matchImports: "\\.(less|css|scss|sass|styl)$"
});

const withFonts = require("next-fonts");

module.exports = removeImports(withFonts(nextConfig))
