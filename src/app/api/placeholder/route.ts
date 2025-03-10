// src/app/api/placeholder/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get width and height from URL path segments
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");

    // Default dimensions if not provided
    let width = 400;
    let height = 300;

    // Extract dimensions from path
    // Expected format: /api/placeholder/[width]/[height]
    if (pathParts.length >= 4) {
      width = parseInt(pathParts[3], 10) || width;
      if (pathParts.length >= 5) {
        height = parseInt(pathParts[4], 10) || height;
      }
    }

    // Create an SVG placeholder
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#eee"/>
      <rect width="100%" height="100%" fill="#333" opacity="0.1"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" 
            fill="#666" text-anchor="middle" dominant-baseline="middle">Image not available</text>
      <text x="50%" y="calc(50% + 30px)" font-family="Arial, sans-serif" font-size="14" 
            fill="#888" text-anchor="middle" dominant-baseline="middle">${width} × ${height}</text>
    </svg>
    `;

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error generating placeholder:", error);
    return NextResponse.json(
      { error: "Failed to generate placeholder" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
