/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "nkowzeugjsbwgwdzptkm.supabase.co"
            }
        ]
    }
};

export default nextConfig;
