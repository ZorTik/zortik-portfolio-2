/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'mb1tiboankdvsitl.public.blob.vercel-storage.com'],
  },
}

module.exports = nextConfig;
