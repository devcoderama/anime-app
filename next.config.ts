import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Konfigurasi untuk mengizinkan semua domain
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Menonaktifkan optimasi ukuran untuk meningkatkan kompatibilitas
    unoptimized: true,
    // Izinkan gambar dari beberapa domain spesifik yang diketahui
    domains: [
      "komikindo2.com",
      "k7rzspb5flu6zayatfe4mh.my",
      "manhwaindo.id",
      "readandlaughweb.files.wordpress.com",
      "i2.wp.com",
      "i3.wp.com",
      "i0.wp.com",
      "i1.wp.com",
    ],
  },
};

export default nextConfig;
