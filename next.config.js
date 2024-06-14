/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["vysvyvruffebmllaeuyi.supabase.co"],
    loader: "custom",
    loaderFile: "./utils/supabase/supabase-image-loader.js",
  },
};

module.exports = nextConfig;
