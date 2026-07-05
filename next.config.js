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
  // Client code needs this to reach files under public/ (e.g. the Stockfish
  // worker) since basePath is not auto-prepended to plain string URLs.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  ...(isStaticExport ? { basePath, assetPrefix: basePath } : {})
};

module.exports = nextConfig;
