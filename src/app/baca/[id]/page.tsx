"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import Link from "next/link";
import { NextImage } from "@/components/NextImage"; // Komponen wrapper untuk next/image

// URL API
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://laravel-api-manga-scraper.vercel.app/api/api";

// Interface untuk konten baca
interface ReadingContent {
  title: string;
  back_chapter: string | null;
  next_chapter: string | null;
  list: string[];
}

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

  // Fungsi untuk mendapatkan URL yang diproxy untuk mengatasi CORS
  const getProxiedImageUrl = (originalUrl: string) => {
    // Encode URL gambar asli untuk digunakan sebagai parameter query
    const encodedUrl = encodeURIComponent(originalUrl);
    return `/api/image?url=${encodedUrl}`;
  };

  // Efek untuk mengambil data
  useEffect(() => {
    const fetchReadingContent = async () => {
      setIsLoading(true);
      setError(null);
      setLoadedImages(0);

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

  // Proses loading gambar
  const loadingProgress =
    content.list.length > 0
      ? Math.round((loadedImages / content.list.length) * 100)
      : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        {/* Judul dan Navigasi */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white text-center">
            {content.title}
          </h1>
        </div>

        {/* Navigasi Chapter */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
          {content.back_chapter ? (
            <Link
              href={`/baca/${encodeURIComponent(
                content.back_chapter.replace(/\/$/, "")
              )}`}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Chapter Sebelumnya
            </Link>
          ) : (
            <button
              disabled
              className="bg-gray-800 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
            >
              Chapter Sebelumnya
            </button>
          )}

          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Kembali ke Beranda
          </Link>

          {content.next_chapter ? (
            <Link
              href={`/baca/${encodeURIComponent(
                content.next_chapter.replace(/\/$/, "")
              )}`}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Chapter Selanjutnya
            </Link>
          ) : (
            <button
              disabled
              className="bg-gray-800 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
            >
              Chapter Selanjutnya
            </button>
          )}
        </div>

        {/* Loading Progress */}
        {loadedImages < content.list.length && (
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-300">Memuat gambar...</span>
              <span className="text-sm text-gray-300">{loadingProgress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Semua Gambar Komik */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          {content.list.map((imageUrl, index) => (
            <div
              key={index}
              className="w-full max-w-3xl bg-black rounded-lg overflow-hidden"
            >
              {/* Menggunakan komponen NextImage untuk mengoptimalkan gambar */}
              <NextImage
                src={getProxiedImageUrl(imageUrl)}
                alt={`${content.title} - Page ${index + 1}`}
                priority={index < 3} // Priority loading untuk 3 gambar pertama
                className="mx-auto w-full"
                onLoad={handleImageLoad}
                onError={handleImageLoad}
              />
            </div>
          ))}
        </div>

        {/* Navigasi Bottom Chapter */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-2">
          {content.back_chapter ? (
            <Link
              href={`/baca/${encodeURIComponent(
                content.back_chapter.replace(/\/$/, "")
              )}`}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Chapter Sebelumnya
            </Link>
          ) : (
            <button
              disabled
              className="bg-gray-800 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
            >
              Chapter Sebelumnya
            </button>
          )}

          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Kembali ke Beranda
          </Link>

          {content.next_chapter ? (
            <Link
              href={`/baca/${encodeURIComponent(
                content.next_chapter.replace(/\/$/, "")
              )}`}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Chapter Selanjutnya
            </Link>
          ) : (
            <button
              disabled
              className="bg-gray-800 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
            >
              Chapter Selanjutnya
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
