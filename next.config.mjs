/** @type {import('next').NextConfig} */
const nextConfig = {
  // static export, unless doing local dev
  output: process.env.NODE_ENV == "development" ? undefined : "export",

  images: {
    unoptimized: true,
  },

  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });
    return config;
  },
};

export default nextConfig;
