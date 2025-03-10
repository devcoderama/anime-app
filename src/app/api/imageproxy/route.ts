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

    // Ambil gambar dari URL asli
    const response = await fetch(decodedUrl);

    if (!response.ok) {
      return new NextResponse("Failed to fetch image", {
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
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
