/* eslint-disable @typescript-eslint/no-require-imports */
const envalid = require('envalid');

const authDependent = envalid.makeValidator((x) => {
  const authEnabled = process.env.HEALTH_AUTH === 'true';

  if (authEnabled && !x.length) {
    throw new Error(`Can't be empty if "HEALTH_AUTH" is true`);
  }

  return x;
});

envalid.cleanEnv(process.env, {
  NEXT_PUBLIC_API_URL: envalid.str(),
  HEALTH_AUTH: envalid.bool(),
  HEALTH_USERNAME: authDependent(),
  HEALTH_PASSWORD: authDependent(),
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  basePath: process.env.NEXT_PUBLIC_BASEPATH || '',
  output: 'standalone',
  sassOptions: {
    prependData: `$basePath: '${process.env.NEXT_PUBLIC_BASEPATH || ''}';`,
  },
  transpilePackages: ['lucide-react'],
  experimental: {
    optimizePackageImports: ['@sk-web-gui'],
  },
  async rewrites() {
    return [{ source: '/napi/:path*', destination: '/api/:path*' }];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: `${process.env.NEXT_PUBLIC_BASEPATH || ''}/oversikt`,
        basePath: false,
        permanent: false,
      },
    ];
  },
});
