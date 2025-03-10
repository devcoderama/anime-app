import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Konfigurasi remotePatterns untuk mengizinkan semua domain
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
    // Menonaktifkan optimasi ukuran untuk meningkatkan kompatibilitas
    // Ini akan mengabaikan optimasi gambar bawaan Next.js
    unoptimized: true,
    // Izinkan gambar dari beberapa domain spesifik yang diketahui
    // Catatan: remotePatterns sudah mengizinkan semua domain,
    // tapi kita bisa menambahkan domain-domain spesifik juga
    domains: [
      "komikindo2.com",
      "k7rzspb5flu6zayatfe4mh.my",
      "manhwaindo.id",
      "readandlaughweb.files.wordpress.com",
      "i2.wp.com",
      "i3.wp.com",
      "i0.wp.com",
      "i1.wp.com",
      "localhost", // Penting untuk development
      "127.0.0.1", // Penting untuk development
    ],
  },
  // Opsional: Anda dapat menambahkan konfigurasi rewrites jika masih mengalami masalah
  // dengan beberapa domain spesifik yang memiliki CORS yang ketat
  async rewrites() {
    return [
      {
        source: "/api/image",
        destination: "/api/imageproxy",
      },
    ];
  },
};

export default nextConfig;
