// src/app/api/image/route.ts
import { NextRequest, NextResponse } from "next/server";

// Cache untuk token, session, dan strategi yang berhasil
// Format: {url: {token, strategy, timestamp}}
const successCache: Record<
  string,
  { token: string; strategy: string; timestamp: number }
> = {};

export async function GET(request: NextRequest) {
  try {
    // Ambil URL gambar dari parameter query
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get("url");

    // Validasi URL gambar
    if (!imageUrl) {
      console.error("URL gambar tidak ada");
      return NextResponse.json(
        { error: "URL gambar tidak ditemukan" },
        { status: 400 }
      );
    }

    // Decode URL yang mungkin terenkode
    const decodedUrl = decodeURIComponent(imageUrl);

    // Ekstrak informasi dari URL
    const urlObj = new URL(decodedUrl);
    const domain = urlObj.hostname;
    const origin = urlObj.origin;
    const path = urlObj.pathname;

    // Deteksi jika ini adalah domain k7 atau domain bermasalah lainnya
    const isK7Domain = domain.includes("k7rzspb5flu6zayatfe4mh.my");
    const hasSimilarPattern =
      /[a-z0-9]{10,}\.my/.test(domain) || path.includes("/data/");
    const isProtectedDomain = isK7Domain || hasSimilarPattern;

    console.log(`Memproxy gambar dari domain: ${domain}, URL: ${decodedUrl}`);
    console.log(`Domain terproteksi: ${isProtectedDomain ? "Ya" : "Tidak"}`);

    // Pendekatan khusus untuk domain terproteksi
    if (isProtectedDomain) {
      return await handleK7Domain(decodedUrl, domain, origin, request);
    }

    // Untuk domain lainnya, gunakan pendekatan reguler
    return await handleRegularDomain(decodedUrl, domain, origin, request);
  } catch (err) {
    // Tangkap dan catat detail error
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`Error proxy gambar: ${errorMessage}`);

    // Redirect ke placeholder
    return NextResponse.redirect(
      new URL("/api/placeholder/400/300", request.nextUrl.origin)
    );
  }
}

// Fungsi khusus untuk menangani domain k7rzspb5flu6zayatfe4mh.my
async function handleK7Domain(
  decodedUrl: string,
  domain: string,
  origin: string,
  request: NextRequest
) {
  // Cek cache untuk strategi yang berhasil sebelumnya (pada path dasar yang sama)
  const pathBase = getPathBase(decodedUrl);
  const cachedSuccess = successCache[pathBase];

  // Jika ada strategi yang berhasil dan masih baru (kurang dari 30 menit)
  if (cachedSuccess && Date.now() - cachedSuccess.timestamp < 30 * 60 * 1000) {
    console.log(
      `Menggunakan strategi yang berhasil sebelumnya: ${cachedSuccess.strategy}`
    );
    try {
      const response = await executeStrategy(
        decodedUrl,
        cachedSuccess.strategy,
        cachedSuccess.token
      );
      if (response.ok || response.status === 304) {
        console.log(`Strategi tersimpan berhasil!`);
        return await processSuccessfulResponse(response, domain);
      }
    } catch {
      console.log("Strategi tersimpan gagal, mencoba strategi baru...");
      // Lanjutkan dengan strategi baru jika strategi tersimpan gagal
    }
  }

  try {
    // Variabel untuk menyimpan token yang diperoleh dari permintaan
    let token = "";
    let cookies = "";

    // === LANGKAH 1: Lakukan permintaan untuk mendapatkan token/cookies ===
    console.log("Mencoba mendapatkan token dari domain...");

    try {
      // Buat tanggal yang berubah untuk header
      const now = new Date();
      const dateHeader = now.toUTCString();

      // Tambahkan timestamp random untuk menghindari cache
      const noCacheParam = `noCache=${Date.now()}`;
      let pingUrl = `${origin}/`;
      if (pingUrl.includes("?")) {
        pingUrl += `&${noCacheParam}`;
      } else {
        pingUrl += `?${noCacheParam}`;
      }

      const pingResponse = await fetch(pingUrl, {
        method: "HEAD",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          Date: dateHeader,
          Pragma: "no-cache",
          "Sec-Ch-Ua": '"Chromium";v="121", "Not A(Brand";v="99"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
        },
        redirect: "manual",
        signal: AbortSignal.timeout(5000),
      });

      // Ekstrak cookie dari respons ping
      const setCookieHeader = pingResponse.headers.get("set-cookie");
      if (setCookieHeader) {
        cookies = setCookieHeader.split(";")[0];
        console.log(`Berhasil mendapatkan cookie: ${cookies}`);

        // Ekstrak token dari cookie (jika ada)
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          token = tokenMatch[1];
          console.log(`Mendapatkan token: ${token}`);
        }
      }
    } catch (err) {
      // Perbaikan: Penggunaan instanceof untuk menangani error dengan aman
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.log("Ping untuk cookie gagal:", errorMessage);
    }

    // Jika tidak ada cookie, buat cookie simulasi
    if (!cookies) {
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2, 10);
      token = `${Buffer.from(pathBase)
        .toString("base64")
        .substring(0, 12)}_${timestamp}`;
      cookies = `token=${token}; visitor=${uniqueId}_${timestamp}; session=sess_${uniqueId}`;
      console.log("Menggunakan cookie simulasi:", cookies);
    }

    // === LANGKAH 2: Coba berbagai strategi untuk mendapatkan gambar ===

    // Urutan strategi dan header (penting untuk dirotasi dengan benar)
    const strategies = [
      "chrome_direct",
      "chrome_nocors",
      "chrome_sessiononly",
      "safari",
      "firefox",
      "chrome_mobile",
      "iphone",
      "google_referer",
      "curl_minimal",
    ];

    let successResponse = null;

    // Coba setiap strategi secara berurutan
    for (const strategy of strategies) {
      if (successResponse) break;

      console.log(`Mencoba strategi: ${strategy}...`);
      try {
        const response = await executeStrategy(decodedUrl, strategy, cookies);

        if (response.ok || response.status === 304) {
          console.log(`Strategi ${strategy} berhasil!`);
          successResponse = response;

          // Simpan strategi yang berhasil ke cache
          successCache[pathBase] = {
            token: cookies,
            strategy: strategy,
            timestamp: Date.now(),
          };
          break;
        } else {
          console.log(
            `Strategi ${strategy} gagal dengan status: ${response.status}`
          );
        }
      } catch (err) {
        // Perbaikan: Penggunaan instanceof untuk menangani error dengan aman
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.log(`Error dengan strategi ${strategy}:`, errorMessage);
      }
    }

    // === LANGKAH 3: Jika semua strategi reguler gagal, coba pendekatan terakhir ===
    if (!successResponse) {
      console.log("Semua strategi gagal, mencoba pendekatan terakhir...");

      // Pendekatan terakhir: Gunakan header minimal tanpa referer atau cookie
      try {
        const response = await fetch(decodedUrl, {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate",
            Connection: "close",
          },
          cache: "no-store",
          redirect: "follow",
          signal: AbortSignal.timeout(15000),
        });

        if (response.ok || response.status === 304) {
          console.log("Pendekatan terakhir berhasil!");
          successResponse = response;

          // Simpan strategi yang berhasil ke cache
          successCache[pathBase] = {
            token: cookies,
            strategy: "googlebot",
            timestamp: Date.now(),
          };
        }
      } catch (err) {
        // Perbaikan: Penggunaan instanceof untuk menangani error dengan aman
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.log("Pendekatan terakhir gagal:", errorMessage);
      }
    }

    // === LANGKAH 4: Proses respons atau tampilkan placeholder ===
    if (successResponse) {
      return await processSuccessfulResponse(successResponse, domain);
    }

    // Semua upaya gagal, redirect ke placeholder
    console.error("Semua metode gagal untuk domain K7");
    const width = request.nextUrl.searchParams.get("w") || "400";
    const height = request.nextUrl.searchParams.get("h") || "300";
    return NextResponse.redirect(
      new URL(`/api/placeholder/${width}/${height}`, request.nextUrl.origin)
    );
  } catch (err) {
    console.error(
      `Error domain K7: ${err instanceof Error ? err.message : String(err)}`
    );
    const width = request.nextUrl.searchParams.get("w") || "400";
    const height = request.nextUrl.searchParams.get("h") || "300";
    return NextResponse.redirect(
      new URL(`/api/placeholder/${width}/${height}`, request.nextUrl.origin)
    );
  }
}

// Fungsi untuk mendapatkan path dasar
function getPathBase(url: string): string {
  try {
    const urlObj = new URL(url);
    // Untuk server K7, path dasar adalah folder yang berisi gambar (tanpa nama file)
    const pathParts = urlObj.pathname.split("/");
    // Hapus nama file (bagian terakhir dari path)
    pathParts.pop();
    return urlObj.origin + pathParts.join("/");
  } catch {
    return url;
  }
}

// Fungsi untuk menjalankan strategi tertentu
async function executeStrategy(
  url: string,
  strategy: string,
  cookies: string
): Promise<Response> {
  // Parameter waktu tunggu untuk setiap strategi
  const timeouts: Record<string, number> = {
    chrome_direct: 10000,
    chrome_nocors: 8000,
    chrome_sessiononly: 8000,
    safari: 10000,
    firefox: 8000,
    chrome_mobile: 10000,
    iphone: 8000,
    google_referer: 10000,
    curl_minimal: 15000,
    googlebot: 15000,
  };

  // URL objek untuk header
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  const origin = urlObj.origin;

  // Header berdasarkan strategi
  let headers: Record<string, string> = {};

  switch (strategy) {
    case "chrome_direct":
      headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: origin + "/",
        Origin: origin,
        Connection: "keep-alive",
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Ch-Ua": '"Chromium";v="121", "Not A(Brand";v="99"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"Windows"',
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        TE: "trailers",
        Cookie: cookies,
        Host: domain,
      };
      break;

    case "chrome_nocors":
      // Chrome tanpa CORS - mirip dengan chrome_direct, tetapi dengan perubahan kecil
      headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: origin + "/",
        Origin: origin,
        Connection: "keep-alive",
        Pragma: "no-cache",
        "Cache-Control": "max-age=0",
        Cookie: cookies,
        Host: domain,
      };
      break;

    case "chrome_sessiononly":
      // Chrome dengan hanya cookie sesi
      const sessionCookie = cookies.includes("session=")
        ? cookies.split(";").find((c) => c.trim().startsWith("session=")) || ""
        : "";

      headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: origin + "/",
        Origin: origin,
        Connection: "keep-alive",
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "same-origin",
        Cookie: sessionCookie,
        Host: domain,
      };
      break;

    case "safari":
      headers = {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        Accept: "image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: origin + "/",
        Connection: "keep-alive",
        Host: domain,
        Cookie: cookies,
      };
      break;

    case "firefox":
      headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
        Accept: "image/avif,image/webp,*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        Referer: origin + "/",
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "same-origin",
        DNT: "1",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        TE: "trailers",
        Cookie: cookies,
        Host: domain,
      };
      break;

    case "chrome_mobile":
      headers = {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36",
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: origin + "/",
        Origin: origin,
        Connection: "keep-alive",
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Ch-Ua": '"Chromium";v="121", "Not A(Brand";v="99"',
        "Sec-Ch-Ua-Mobile": "?1",
        "Sec-Ch-Ua-Platform": '"Android"',
        Cookie: cookies,
        Host: domain,
        "Save-Data": "on",
        "Cache-Control": "no-cache",
      };
      break;

    case "iphone":
      headers = {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        Accept:
          "image/webp,image/png,image/svg+xml,image/*;q=0.8,video/*;q=0.8,*/*;q=0.5",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: origin + "/",
        Connection: "keep-alive",
        Host: domain,
        Cookie: cookies,
      };
      break;

    case "google_referer":
      headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "cross-site",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        TE: "trailers",
        Cookie: cookies,
        Host: domain,
      };
      break;

    case "curl_minimal":
      headers = {
        "User-Agent": "curl/7.83.1",
        Accept: "*/*",
        Host: domain,
      };
      break;

    case "googlebot":
      headers = {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate",
        Connection: "close",
        Host: domain,
      };
      break;

    default:
      // Default ke Chrome jika strategi tidak dikenal
      headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        Host: domain,
      };
  }

  // Persiapkan parameter fetch
  const fetchOptions: RequestInit = {
    method: "GET",
    headers,
    cache: "no-store",
    redirect: "follow",
    signal: AbortSignal.timeout(timeouts[strategy] || 10000),
  };

  // Eksekusi fetch
  return await fetch(url, fetchOptions);
}

// Fungsi untuk domain reguler
async function handleRegularDomain(
  decodedUrl: string,
  domain: string,
  origin: string,
  request: NextRequest
) {
  try {
    // Coba fetch gambar dengan header browser normal
    const userAgent =
      request.headers.get("user-agent") ||
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

    const headers = {
      "User-Agent": userAgent,
      Accept:
        "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
      Referer: origin,
      Connection: "keep-alive",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    };

    // Coba fetch gambar
    const response = await fetch(decodedUrl, {
      method: "GET",
      headers,
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    // Jika respons berhasil, kembalikan
    if (response.ok || response.status === 304) {
      return await processSuccessfulResponse(response, domain);
    }

    // Jika gagal dengan 403, coba referrer Google
    if (response.status === 403) {
      console.log("Respons 403, mencoba dengan referrer Google...");

      const googleHeaders = {
        "User-Agent": userAgent,
        Accept:
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      };

      const googleResponse = await fetch(decodedUrl, {
        method: "GET",
        headers: googleHeaders,
        cache: "no-store",
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });

      if (googleResponse.ok || googleResponse.status === 304) {
        return await processSuccessfulResponse(googleResponse, domain);
      }

      // Masih gagal, coba pendekatan minimal
      console.log("Referrer Google gagal, mencoba dengan header minimal...");

      const minimalHeaders = {
        "User-Agent": userAgent,
        Accept: "image/*",
      };

      const minimalResponse = await fetch(decodedUrl, {
        method: "GET",
        headers: minimalHeaders,
        cache: "no-store",
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });

      if (minimalResponse.ok || minimalResponse.status === 304) {
        return await processSuccessfulResponse(minimalResponse, domain);
      }

      // Semua upaya gagal, redirect ke placeholder
      console.error("Semua metode gagal untuk domain reguler");
      const width = request.nextUrl.searchParams.get("w") || "400";
      const height = request.nextUrl.searchParams.get("h") || "300";
      return NextResponse.redirect(
        new URL(`/api/placeholder/${width}/${height}`, request.nextUrl.origin)
      );
    }

    // Untuk status lain, coba proses respons tersebut
    return await processSuccessfulResponse(response, domain);
  } catch (err) {
    console.error(
      `Error domain reguler: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    const width = request.nextUrl.searchParams.get("w") || "400";
    const height = request.nextUrl.searchParams.get("h") || "300";
    return NextResponse.redirect(
      new URL(`/api/placeholder/${width}/${height}`, request.nextUrl.origin)
    );
  }
}

// Fungsi untuk memproses respons yang berhasil
async function processSuccessfulResponse(response: Response, domain: string) {
  // Dapatkan tipe konten dan body dari response
  const contentType = response.headers.get("content-type") || "image/jpeg";
  const buffer = await response.arrayBuffer();

  console.log(
    `Berhasil memproxy gambar dari ${domain}, ukuran: ${buffer.byteLength} bytes`
  );

  // Kirim gambar dengan header yang benar
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400", // Cache for 1 day
      "Access-Control-Allow-Origin": "*", // Izinkan akses dari domain manapun
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Max-Age": "86400",
      "X-Proxy-Status": "success",
    },
  });
}

// Use Edge Runtime for better performance
export const runtime = "edge";
