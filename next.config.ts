import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
            },
        ],
    },
    allowedDevOrigins: ['http://100.80.5.1:3000', 'http://localhost:3000'],
}

export default nextConfig
