/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "nkowzeugjsbwgwdzptkm.supabase.co"
            },
            {
                protocol: 'https',
                hostname: "upload.wikimedia.org"
            },
            {
                protocol: "https",
                hostname: "encrypted-tbn0.gstatic.com"
            }
        ]
    }
};

export default nextConfig;
