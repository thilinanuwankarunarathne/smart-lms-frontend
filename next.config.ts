/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This generates the /out folder
  images: {
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;