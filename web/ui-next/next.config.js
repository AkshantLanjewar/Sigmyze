/** @type {import('next').NextConfig} */
const isDevelopment  = process.env.NODE_ENV !== "production"
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
    }
}

module.exports = nextConfig
