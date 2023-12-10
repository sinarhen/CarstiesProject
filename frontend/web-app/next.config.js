/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                "protocol": "https",
                "hostname": 'cdn.pixabay.com',
                "pathname": '**',
            },
            {
                "protocol": "https",
                "hostname": 'upload-widget.cloudinary.com',
                "pathname": '**',
                
            }
        ]
    }
}

module.exports = nextConfig
