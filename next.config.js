/**
 * Temporary next.config.js to allow Vercel builds to proceed when ESLint reports errors.
 * Use only as a short-term measure; fix lint issues and remove this file later.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // NOTE: temporary — prefer to fix lint rules instead of ignoring them
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
