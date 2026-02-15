/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repository = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, "") || "";
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = isStaticExport && isGithubActions && repository ? `/${repository}` : "";

const nextConfig = {
  reactStrictMode: true,
  ...(isStaticExport ? { output: "export", trailingSlash: true } : {}),
  images: {
    unoptimized: true
  },
  ...(isStaticExport ? { basePath, assetPrefix: basePath } : {})
};

module.exports = nextConfig;
