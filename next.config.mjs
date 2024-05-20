import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // static export, unless doing local dev
  output: process.env.NODE_ENV == "development" ? undefined : "export",

  images: {
    unoptimized: true,
  },

  async redirects() {
    return [
      {
        source: "/ecs-demo",
        destination: "/ecs-demo/index.html",
        permanent: true,
      },
      {
        source: "/gouaches",
        destination: "/gouaches/index.html",
        permanent: true,
      },
    ];
  },

  webpack: function (config) {
    return config;
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
