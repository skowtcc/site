import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    allowedDevOrigins: ['http://100.80.5.1:3000', 'http://localhost:3000'],
}

export default nextConfig
