// src/app/api/imageproxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Ambil URL gambar dari parameter query
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get("url");

  // Validasi URL gambar
  if (!imageUrl) {
    return new NextResponse("Missing image URL", { status: 400 });
  }

  try {
    // Decode URL gambar yang mungkin di-encode
    const decodedUrl = decodeURIComponent(imageUrl);

    // Dapatkan origin dari URL untuk digunakan sebagai referer
    const urlObj = new URL(decodedUrl);
    const origin = urlObj.origin;

    // Setup header yang lengkap dan menyerupai browser asli
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
      Referer: origin,
      Origin: origin,
      "Sec-Fetch-Dest": "image",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "cross-site",
      "Sec-Ch-Ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    };

    // Ambil gambar dari URL asli dengan header yang ditingkatkan
    const response = await fetch(decodedUrl, {
      headers,
      cache: "no-store",
      next: { revalidate: 0 }, // Untuk Next.js 13+
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
      return new NextResponse(`Failed to fetch image: ${response.status}`, {
        status: response.status,
      });
    }

    // Ambil tipe konten dan body dari respons
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    // Kirim gambar dengan header yang benar
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache selama 1 hari
        "Access-Control-Allow-Origin": "*", // Izinkan akses dari mana saja
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}

// Menggunakan Edge Runtime untuk performa lebih baik
export const runtime = "edge";
