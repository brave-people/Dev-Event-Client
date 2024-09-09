import path from 'path';
import { fileURLToPath } from 'url';
import removeImports from 'next-remove-imports';

const prod = process.env.NODE_ENV === 'production';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const removeImportsFun = removeImports({
  // test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
  // matchImports: "\\.(less|css|scss|sass|styl)$"
});

export default removeImportsFun({
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
  experimental: {
    appDir: true,
  },
});
