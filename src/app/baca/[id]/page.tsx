/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import Link from "next/link";
import MobileButton from "@/components/Button/MobileButton";
import DesktopButton from "@/components/Button/DesktopButton";
import {
  HomeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  LoadingSpinnerIcon,
} from "@/components/Icons/NavigationIcons";

// URL API
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://laravel-api-manga-scraper.vercel.app/api/api";

// URL untuk image proxy
const IMAGE_PROXY_URL = process.env.NEXT_PUBLIC_IMAGE_PROXY_URL || "/api/image";

// Interface untuk konten baca
interface ReadingContent {
  title: string;
  back_chapter: string | null;
  next_chapter: string | null;
  list: string[];
}

// Komponen DirectImage yang ditingkatkan dengan strategi fallback
const DirectImage = ({
  src,
  alt,
  className = "",
  priority = false,
  onLoad,
  onError,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}) => {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [errorCount, setErrorCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const placeholderImage = "/placeholder.jpg";

  // Reset state jika URL sumber berubah
  useEffect(() => {
    setLoading(true);
    setErrorCount(0);

    // Cek apakah URL sudah menggunakan proxy atau belum
    if (src.startsWith(IMAGE_PROXY_URL) || src.includes("?url=")) {
      setImgSrc(src);
    } else {
      // Jika belum, gunakan proxy untuk URL eksternal
      setImgSrc(`${IMAGE_PROXY_URL}?url=${encodeURIComponent(src)}`);
    }
  }, [src]);

  const handleError = () => {
    console.log(`Image error level ${errorCount} for: ${alt}`);
    setLoading(false);

    if (errorCount === 0) {
      // Jika error pertama, coba gunakan proxy dengan strategi berbeda
      // Dengan menambahkan parameter strategi untuk memicu penggunaan strategi yang berbeda
      const proxyWithStrategy = `${IMAGE_PROXY_URL}?url=${encodeURIComponent(
        src
      )}&strategy=${Date.now()}`;
      setImgSrc(proxyWithStrategy);
      setErrorCount(1);
    } else if (errorCount === 1) {
      // Jika masih error, coba URL asli tanpa proxy
      setImgSrc(src);
      setErrorCount(2);
    } else if (errorCount === 2) {
      // Coba URL asli dengan parameter nocache untuk memaksa refresh
      setImgSrc(`${src}${src.includes("?") ? "&" : "?"}nocache=${Date.now()}`);
      setErrorCount(3);
    } else {
      // Fallback ke placeholder
      setImgSrc(placeholderImage);
      setErrorCount(4);

      // Panggil callback onError jika ada
      if (onError) {
        onError();
      }
    }
  };

  const handleLoad = () => {
    setLoading(false);
    if (onLoad) {
      onLoad();
    }
  };

  return (
    <div className="relative w-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className || "w-full h-auto"} ${
          loading ? "opacity-30" : "opacity-100"
        }`}
        loading={priority ? "eager" : "lazy"}
        onError={handleError}
        onLoad={handleLoad}
        style={{ objectFit: "contain", maxWidth: "100%" }}
      />
    </div>
  );
};

export default function BacaPage() {
  const params = useParams();
  let id = params.id as string;

  // Perbaikan: Hapus trailing slash jika ada
  if (id.endsWith("%2F")) {
    id = id.slice(0, -3); // Menghapus '%2F' di akhir
  } else if (id.endsWith("/")) {
    id = id.slice(0, -1); // Menghapus '/' di akhir
  }

  const [content, setContent] = useState<ReadingContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<number>(0);
  const [failedImages, setFailedImages] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Cek ukuran layar untuk menentukan tampilan mobile atau desktop
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Efek untuk mengambil data
  useEffect(() => {
    const fetchReadingContent = async () => {
      setIsLoading(true);
      setError(null);
      setLoadedImages(0);
      setFailedImages(0);

      try {
        const response = await fetch(`${API_URL}/baca/${id}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setContent(data.data);
        } else {
          throw new Error("Failed to fetch reading content");
        }
      } catch (error) {
        console.error(`Error fetching reading content for ${id}:`, error);
        setError("Gagal mengambil konten komik.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchReadingContent();
    }
  }, [id]);

  // Handler untuk mencatat jumlah gambar yang telah dimuat
  const handleImageLoad = () => {
    setLoadedImages((prev) => prev + 1);
  };

  // Handler untuk mencatat gambar yang gagal dimuat
  const handleImageError = () => {
    setFailedImages((prev) => prev + 1);
    // Tetap increment loaded karena kita menganggap gambar "loaded" meskipun dengan placeholder
    setLoadedImages((prev) => prev + 1);
  };

  // Kondisi loading
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-800 rounded-lg p-4 mb-6 animate-pulse">
            <div className="h-6 bg-gray-700 w-3/4 rounded"></div>
          </div>
          <div className="bg-gray-800 flex justify-between p-4 mb-6 animate-pulse">
            <div className="h-10 w-28 bg-gray-700 rounded"></div>
            <div className="h-10 w-28 bg-gray-700 rounded"></div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-3xl h-[70vh] bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // Kondisi error
  if (error || !content) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4 text-white">
              Chapter Tidak Ditemukan
            </h1>
            <p className="mb-6 text-gray-400">
              {error ||
                "Konten yang Anda cari tidak tersedia atau telah dihapus."}
            </p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Persiapkan URLs untuk chapter navigasi
  const prevChapterUrl = content.back_chapter
    ? `/baca/${encodeURIComponent(content.back_chapter.replace(/\/$/, ""))}`
    : undefined;

  const nextChapterUrl = content.next_chapter
    ? `/baca/${encodeURIComponent(content.next_chapter.replace(/\/$/, ""))}`
    : undefined;

  // Proses loading gambar
  const loadingProgress =
    content.list.length > 0
      ? Math.round((loadedImages / content.list.length) * 100)
      : 0;

  // Render button yang sesuai berdasarkan screen size
  const ButtonComponent = isMobile ? MobileButton : DesktopButton;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        {/* Judul dan Navigasi */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white text-center">
            {content.title}
          </h1>
        </div>

        {/* Navigasi Chapter dengan Komponen Terpisah */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
          <ButtonComponent
            href={prevChapterUrl}
            disabled={!content.back_chapter}
            icon={<ArrowLeftIcon />}
            iconPosition="left"
          >
            Chapter Sebelumnya
          </ButtonComponent>

          <ButtonComponent
            href="/"
            variant="primary"
            icon={<HomeIcon />}
            iconPosition="left"
          >
            Beranda
          </ButtonComponent>

          <ButtonComponent
            href={nextChapterUrl}
            disabled={!content.next_chapter}
            icon={<ArrowRightIcon />}
            iconPosition="right"
          >
            Chapter Selanjutnya
          </ButtonComponent>
        </div>

        {/* Loading Progress */}
        {loadedImages < content.list.length && (
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-300 flex items-center">
                <LoadingSpinnerIcon />
                Memuat gambar...
              </span>
              <span className="text-sm text-white font-semibold bg-blue-600 px-2 py-0.5 rounded-full">
                {loadingProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300 relative"
                style={{ width: `${loadingProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-300 opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Info tentang gambar yang gagal dimuat */}
        {failedImages > 0 && (
          <div className="bg-yellow-800 bg-opacity-40 border border-yellow-600 text-yellow-200 px-4 py-3 rounded mb-6 text-sm">
            <p>
              <strong>Catatan:</strong> {failedImages} gambar tidak dapat dimuat
              dengan benar dan digantikan dengan placeholder.
            </p>
          </div>
        )}

        {/* Semua Gambar Komik - Tanpa Jarak Sama Sekali */}
        <div className="flex flex-col items-center bg-black rounded-lg overflow-hidden mb-6">
          {content.list.map((imageUrl, index) => (
            <div
              key={index}
              className="w-full max-w-3xl"
              style={{ margin: 0, padding: 0, lineHeight: 0 }}
            >
              {/* Menggunakan DirectImage dengan proxy dan strategi fallback */}
              <DirectImage
                src={imageUrl}
                alt={`${content.title} - Page ${index + 1}`}
                priority={index < 3} // Priority loading untuk 3 gambar pertama
                className="mx-auto w-full"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          ))}
        </div>

        {/* Navigasi Bottom Chapter */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-2">
          <ButtonComponent
            href={prevChapterUrl}
            disabled={!content.back_chapter}
            icon={<ArrowLeftIcon />}
            iconPosition="left"
          >
            Chapter Sebelumnya
          </ButtonComponent>

          <ButtonComponent
            href="/"
            variant="primary"
            icon={<HomeIcon />}
            iconPosition="left"
          >
            Beranda
          </ButtonComponent>

          <ButtonComponent
            href={nextChapterUrl}
            disabled={!content.next_chapter}
            icon={<ArrowRightIcon />}
            iconPosition="right"
          >
            Chapter Selanjutnya
          </ButtonComponent>
        </div>
      </div>
    </Layout>
  );
}
