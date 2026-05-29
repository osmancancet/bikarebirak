import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // archiver ve firebase-admin gibi Node-only CJS paketleri Turbopack'in
  // statik analizinden muaf tut; Node tarafında doğrudan require'lansınlar.
  serverExternalPackages: ["archiver", "firebase-admin", "pdfkit"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
