// src/app/api/image/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Ambil URL gambar dari parameter query
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get("url");

    // Validasi URL gambar
    if (!imageUrl) {
      console.error("Missing image URL");
      return NextResponse.json(
        { error: "URL gambar tidak ditemukan" },
        { status: 400 }
      );
    }

    // Decode URL gambar yang mungkin di-encode
    const decodedUrl = decodeURIComponent(imageUrl);

    // Dapatkan domain dari URL
    const urlObj = new URL(decodedUrl);
    const domain = urlObj.hostname;

    console.log(`Proxying image from domain: ${domain}, URL: ${decodedUrl}`);

    // Header untuk request - lebih lengkap dan menyerupai browser
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
      Referer: urlObj.origin,
      Origin: urlObj.origin,
      "Sec-Fetch-Dest": "image",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "cross-site",
      "Sec-Ch-Ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Cache-Control": "no-cache",
    };

    // Ambil gambar dengan fetch, timeout setelah 15 detik
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error(`Timeout fetching image: ${decodedUrl}`);
    }, 15000); // 15 detik timeout

    const response = await fetch(decodedUrl, {
      method: "GET",
      headers,
      signal: controller.signal,
      cache: "no-store",
      next: { revalidate: 0 },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(
        `Fetch failed: ${response.status} ${response.statusText} for ${decodedUrl}`
      );
      return NextResponse.json(
        { error: `Gagal mengambil gambar: ${response.status}` },
        { status: response.status }
      );
    }

    // Ambil tipe konten dan body dari respons
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    console.log(
      `Successfully proxied image from ${domain}, size: ${buffer.byteLength} bytes`
    );

    // Kirim gambar dengan header yang benar
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache selama 1 hari
        "Access-Control-Allow-Origin": "*", // Izinkan akses dari mana saja
      },
    });
  } catch (error) {
    // Tangkap dan log detail error
    console.error("Image proxy error:", error);

    // Pesan error yang lebih informatif
    let errorMessage = "Error fetching image";
    if (error instanceof Error) {
      errorMessage = `${errorMessage}: ${error.name} - ${error.message}`;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Menggunakan Edge Runtime untuk performa lebih baik
export const runtime = "edge";
