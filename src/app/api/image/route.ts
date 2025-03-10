// src/app/api/image/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get image URL from query parameter
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get("url");

    // Validate image URL
    if (!imageUrl) {
      console.error("Missing image URL");
      return NextResponse.json(
        { error: "URL gambar tidak ditemukan" },
        { status: 400 }
      );
    }

    // Decode URL that might be encoded
    const decodedUrl = decodeURIComponent(imageUrl);

    // Get domain from URL
    const urlObj = new URL(decodedUrl);
    const domain = urlObj.hostname;
    const origin = urlObj.origin;

    console.log(`Proxying image from domain: ${domain}, URL: ${decodedUrl}`);

    // Get the referer from the request or set it to the target origin
    const referer = request.headers.get("referer") || origin;

    // Get the user's IP if available (for logging)
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";

    // Randomize the User-Agent to avoid pattern detection
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    ];
    const randomUserAgent =
      userAgents[Math.floor(Math.random() * userAgents.length)];

    // Define header type with optional properties
    type HeadersType = {
      "User-Agent": string;
      Accept: string;
      "Accept-Language": string;
      Referer?: string;
      Origin?: string;
      Host?: string;
      "Sec-Fetch-Dest": string;
      "Sec-Fetch-Mode": string;
      "Sec-Fetch-Site": string;
      "Sec-Ch-Ua": string;
      "Sec-Ch-Ua-Mobile": string;
      "Sec-Ch-Ua-Platform": string;
      "Cache-Control"?: string;
      DNT: string;
      Connection: string;
      [key: string]: string | undefined;
    };

    // More complete and browser-like headers
    const headers: HeadersType = {
      "User-Agent": randomUserAgent,
      Accept:
        "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
      Referer: referer,
      Origin: origin,
      Host: domain,
      "Sec-Fetch-Dest": "image",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "cross-site",
      "Sec-Ch-Ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Cache-Control": "no-cache",
      DNT: "1",
      Connection: "keep-alive",
    };

    // Try different approaches to fetch the image
    let response = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (!response && attempts < maxAttempts) {
      attempts++;

      try {
        // Timeout yang berbeda untuk setiap percobaan
        const timeoutMs = attempts === 1 ? 8000 : attempts === 2 ? 5000 : 3000;

        console.log(
          `Attempt ${attempts} for ${decodedUrl} with timeout ${timeoutMs}ms`
        );

        // Modify headers slightly on each attempt
        const currentHeaders = { ...headers };
        if (attempts > 1) {
          // On subsequent attempts, modify some headers
          currentHeaders["Cache-Control"] = "max-age=0";

          if (attempts === 3) {
            // Pada percobaan ketiga, ganti referer dan origin dengan google
            // Gunakan cara yang aman dengan TypeScript - jangan menggunakan delete
            currentHeaders.Referer = "https://www.google.com/";
            currentHeaders.Origin = "https://www.google.com";
          }
        }

        // Gunakan Promise.race untuk menangani timeout
        const fetchPromise = fetch(decodedUrl, {
          method: "GET",
          headers: currentHeaders as HeadersInit,
          cache: "no-store",
          next: { revalidate: 0 },
          redirect: "follow",
        });

        // Timeout promise that rejects after specified milliseconds
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Timeout after ${timeoutMs}ms`));
          }, timeoutMs);
        });

        // Race between fetch and timeout
        response = (await Promise.race([
          fetchPromise,
          timeoutPromise,
        ])) as Response;

        // If we got a successful response, break the loop
        if (response.ok) {
          break;
        } else {
          console.error(
            `Attempt ${attempts} failed: ${response.status} ${response.statusText} for ${decodedUrl}`
          );

          // If we get a 403, try a different approach on next attempt
          if (response.status === 403) {
            response = null; // Reset for next attempt
          } else {
            // For other errors, just break and return the error
            break;
          }
        }
      } catch (err) {
        // Tangani error dengan lebih detail
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Attempt ${attempts} error: ${errorMessage}`);

        // Lanjutkan ke percobaan berikutnya
        response = null;

        // Jika ini adalah percobaan terakhir, tunggu sedikit sebelum menyerah
        if (attempts === maxAttempts) {
          // Berikan jeda singkat sebelum mencoba fallback terakhir
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    // If all attempts failed
    if (!response || !response.ok) {
      // Try fallback strategy with more direct approach
      try {
        console.log("Trying fallback method for bypassing 403...");

        // Simplified fetch with minimal headers
        const fallbackResponse = await fetch(decodedUrl, {
          method: "GET",
          headers: {
            "User-Agent": randomUserAgent,
            Accept: "image/*",
            Referer: "https://www.google.com/",
            Origin: "https://www.google.com",
          },
          cache: "no-store",
          // Extra long timeout for last attempt
          signal: AbortSignal.timeout(15000),
        });

        if (fallbackResponse.ok) {
          response = fallbackResponse;
          console.log("Fallback method succeeded");
        } else {
          console.error(`Fallback failed: ${fallbackResponse.status}`);
        }
      } catch (fallbackErr) {
        const errorMessage =
          fallbackErr instanceof Error
            ? fallbackErr.message
            : String(fallbackErr);
        console.error(`Fallback error: ${errorMessage}`);
      }
    }

    // Final check if we have a valid response
    if (!response || !response.ok) {
      // Perbaikan: Hapus variabel status yang tidak digunakan
      const message = response
        ? `Status: ${response.status} ${response.statusText}`
        : "All attempts failed";

      console.error(
        `Failed to proxy image after ${attempts} attempts. ${message}`
      );

      // Redirect ke placeholder
      const width = searchParams.get("w") || "400";
      const height = searchParams.get("h") || "300";

      return NextResponse.redirect(
        new URL(`/api/placeholder/${width}/${height}`, request.nextUrl.origin)
      );
    }

    // Get content type and body from response
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    console.log(
      `Successfully proxied image from ${domain}, size: ${buffer.byteLength} bytes, client: ${clientIp}`
    );

    // Send the image with correct headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 1 day
        "Access-Control-Allow-Origin": "*", // Allow access from anywhere
        "X-Proxy-Status": "success",
      },
    });
  } catch (error) {
    // Catch and log error details
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Image proxy error: ${errorMessage}`);

    // Redirect ke placeholder
    return NextResponse.redirect(
      new URL("/api/placeholder/400/300", request.nextUrl.origin)
    );
  }
}

// Use Edge Runtime for better performance
export const runtime = "edge";
