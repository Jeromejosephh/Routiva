import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      //www → apex
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.routiva.app" }],
        destination: "https://routiva.app/:path*",
        permanent: true,
      },
      //prevent auth flows on preview subdomains
      {
        source: "/api/auth/:path*",
        has: [{ type: "host", value: ":sub*.vercel.app" }],
        destination: "https://routiva.app/api/auth/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
