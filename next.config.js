import path from 'path';
import url from 'url';

const prod = process.env.NODE_ENV === 'production';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const nextConfig = {
  webpack: (config) => {
    return {
      ...config,
      mode: prod ? 'production' : 'development',
    };
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: process.env.NEXT_PUBLIC_ADMIN_DOMAIN + '/:path*',
        },
      ],
    };
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
