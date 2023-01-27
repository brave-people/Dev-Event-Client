import path from 'path';
import { fileURLToPath } from 'url';

const prod = process.env.NODE_ENV === 'production';
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default {
  webpack: (config) => {
    return {
      ...config,
      mode: prod ? 'production' : 'development',
    };
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: process.env.NEXT_PUBLIC_ADMIN_DOMAIN + '/:path*',
      },
    ];
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: ['brave-people-3.s3.ap-northeast-2.amazonaws.com'],
  },
};
