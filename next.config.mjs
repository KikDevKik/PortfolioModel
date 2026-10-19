/** @type {import('next').NextConfig} */
const nextConfig = {
  // The content files (content/**) are read at runtime when pages refresh,
  // so they must be shipped with every server function on Vercel.
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
