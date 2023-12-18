/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                "protocol": "https",
                "hostname": 'cdn.pixabay.com',
                "pathname": '**',
            },
            {
                "protocol": "https",
                "hostname": 'res.cloudinary.com',
                "pathname": '**',
                
            },
        ]
    },
    output: 'standalone'
}

module.exports = nextConfig
