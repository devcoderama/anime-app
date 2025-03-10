/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import Link from "next/link";

// URL API
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://laravel-api-manga-scraper.vercel.app/api/api";

// Definisi ulang tipe Comic untuk memastikan kecocokan dengan data API
interface ApiComic {
  title: string;
  img: string;
  link: string;
  chapter?: string;
  type?: string;
  rating?: string | number;
  jenis?: string;
  last_update?: string;
  hot?: boolean;
  // tambahkan properti lain yang mungkin hadir dalam data API
  [key: string]: unknown; // untuk properti dinamis lainnya - gunakan unknown bukan any
}

// Komponen DirectImage sederhana untuk gambar pencarian
const SearchResultImage = ({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  // State untuk tracking error
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  // Handler ketika gambar error
  const handleError = () => {
    if (!hasError) {
      console.log(`Image failed to load: ${alt}`);
      setImgSrc("/placeholder.jpg");
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

// Komponen SearchResultCard sebagai pengganti ComicCard
const SearchResultCard = ({ comic }: { comic: ApiComic }) => {
  // Proses URL untuk mendapatkan path detail yang benar
  const getDetailPath = (link: string) => {
    // Hapus trailing slash jika ada
    const cleanLink = link.endsWith("/") ? link.slice(0, -1) : link;

    // Jika URL sudah mengandung "/detail/", gunakan apa adanya
    if (cleanLink.includes("/detail/")) {
      return cleanLink;
    }

    // Untuk kasus lainnya, ambil bagian terakhir dari URL dan tambahkan ke /detail/
    // Ekstrak slug dari URL
    const slug = cleanLink.split("/").pop() || "";

    // Kembalikan URL dengan format /detail/slug
    return `/detail/${slug}`;
  };

  // Mendapatkan path detail yang benar
  const detailPath = getDetailPath(comic.link);

  return (
    <Link href={detailPath} className="block h-full">
      <div className="bg-gray-800 rounded-lg overflow-hidden h-full shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-56 w-full overflow-hidden">
          {/* Image container dengan fallback ke placeholder */}
          <div className="absolute inset-0 bg-gray-700">
            <SearchResultImage
              src={comic.img}
              alt={comic.title}
              className="w-full h-full object-cover transition-all duration-300 hover:scale-110"
            />
          </div>

          {comic.type && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              {comic.type}
            </div>
          )}

          {comic.hot && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                />
              </svg>
              Hot
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white mb-1 line-clamp-1">
            {comic.title}
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              Ch. {comic.chapter || "?"}
            </span>
            {comic.rating && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-yellow-400 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs text-gray-400">{comic.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function SearchPage() {
  const params = useParams();
  const encodedKeyword = params.keyword as string;
  const [decodedKeyword, setDecodedKeyword] = useState<string>("");

  // Gunakan tipe ApiComic yang kita definisikan
  const [comics, setComics] = useState<ApiComic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Decode the keyword for display
  useEffect(() => {
    try {
      const decoded = decodeURIComponent(encodedKeyword);
      setDecodedKeyword(decoded);
    } catch (error) {
      // Fallback to the encoded version if there's a decoding error
      console.error("Error decoding keyword:", error);
      setDecodedKeyword(encodedKeyword);
    }
  }, [encodedKeyword]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!encodedKeyword) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/search/${encodedKeyword}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          // Cast data ke tipe yang kita harapkan
          setComics(data.data as ApiComic[]);
        } else {
          throw new Error("Failed to fetch search results");
        }
      } catch (error) {
        console.error(`Error searching for "${decodedKeyword}":`, error);
        setError("Gagal melakukan pencarian.");
      } finally {
        setIsLoading(false);
      }
    };

    if (encodedKeyword) {
      fetchSearchResults();
    }
  }, [encodedKeyword, decodedKeyword]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Hasil Pencarian:{" "}
            <span className="text-blue-400">{decodedKeyword}</span>
          </h1>
          <p className="text-gray-400">
            Menampilkan hasil untuk kata kunci yang Anda cari
          </p>
        </div>

        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6 shadow-md">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg overflow-hidden animate-pulse shadow-md"
              >
                <div className="h-56 bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {comics.length > 0 ? (
              <>
                <p className="text-gray-300 mb-4">
                  Ditemukan {comics.length} hasil untuk &quot;{decodedKeyword}
                  &quot;
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {comics.map((comic, index) => (
                    <div
                      key={`search-${index}-${comic.link}`}
                      className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                    >
                      {/* Menggunakan SearchResultCard alih-alih ComicCard */}
                      <SearchResultCard comic={comic} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-gray-800 rounded-lg shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Tidak Ditemukan
                </h2>
                <p className="text-gray-400 mb-6">
                  Tidak ada komik yang ditemukan untuk kata kunci &quot;
                  {decodedKeyword}&quot;.
                </p>
                <Link
                  href="/"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Kembali ke Beranda
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
