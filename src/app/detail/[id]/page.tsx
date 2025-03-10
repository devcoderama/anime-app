"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";
import ComicCard from "@/components/pages/ComicCard";

// URL API
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://laravel-api-manga-scraper.vercel.app/api/api";

// Interface untuk detail komik
interface ComicDetail {
  judul: string;
  img: string;
  ratting: string | null;
  judul_alternatif: string | null;
  status: string | null;
  pengarang: string | null;
  ilustrator: string | null;
  jenis: string | null;
  tema: string[] | null;
  genre: string[] | null;
  short_sinopsis: string | null;
  sinopsis: string | null;
  spoiler: string[] | null;
  mirip:
    | {
        url: string;
        img: string;
        title: string;
        subtitle: string | null;
        type: string | null;
        jenis: string | null;
      }[]
    | null;
  chapter:
    | {
        url: string;
        chapter: string;
        update: string;
      }[]
    | null;
}

export default function DetailPage() {
  const params = useParams();
  let id = params.id as string;

  // Perbaikan: Hapus trailing slash jika ada
  if (id.endsWith("%2F")) {
    id = id.slice(0, -3); // Menghapus '%2F' di akhir
  } else if (id.endsWith("/")) {
    id = id.slice(0, -1); // Menghapus '/' di akhir
  }

  const [comic, setComic] = useState<ComicDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComicDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Gunakan ID yang sudah dibersihkan
        const response = await fetch(`${API_URL}/detail/${id}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setComic(data.data);
        } else {
          throw new Error("Failed to fetch comic details");
        }
      } catch (error) {
        console.error(`Error fetching comic detail for ${id}:`, error);
        setError("Gagal mengambil detail komik.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchComicDetail();
    }
  }, [id]);

  // Kondisi loading
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex animate-pulse">
              <div className="md:w-1/3 p-6">
                <div className="relative h-96 w-full bg-gray-700 rounded"></div>
                <div className="mt-4 space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-gray-700 rounded w-20"></div>
                  ))}
                </div>
                <div className="space-y-2 mt-6">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Kondisi error
  if (error || !comic) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4 text-white">
              Komik Tidak Ditemukan
            </h1>
            <p className="mb-6 text-gray-400">
              {error ||
                "Komik yang Anda cari tidak tersedia atau telah dihapus."}
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Bagian kiri - Gambar dan Info dasar */}
            <div className="md:w-1/3 p-6">
              <div className="relative h-96 w-full">
                <Image
                  src={comic.img || "/placeholder.jpg"}
                  alt={comic.judul}
                  fill
                  className="object-cover rounded"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.jpg";
                  }}
                />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-300">Status:</span>
                  <span className="text-white">
                    {comic.status || "Tidak diketahui"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-300">Tipe:</span>
                  <span className="text-white">
                    {comic.jenis || "Tidak diketahui"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-300">Rating:</span>
                  <span className="text-white">
                    ⭐ {comic.ratting || "N/A"}
                  </span>
                </div>
                {comic.pengarang && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-300">
                      Pengarang:
                    </span>
                    <span className="text-white">{comic.pengarang}</span>
                  </div>
                )}
                {comic.ilustrator && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-300">
                      Ilustrator:
                    </span>
                    <span className="text-white">{comic.ilustrator}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bagian kanan - Judul, genre, dan sinopsis */}
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {comic.judul}
              </h1>
              {comic.judul_alternatif && (
                <p className="text-gray-400 mb-4">{comic.judul_alternatif}</p>
              )}

              {/* Genre */}
              {comic.genre && comic.genre.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-white mb-2">Genre:</h3>
                  <div className="flex flex-wrap gap-2">
                    {comic.genre.map((g, index) => (
                      <Link
                        key={index}
                        href={`/genre/${encodeURIComponent(g)}/1`}
                        className="bg-gray-700 px-3 py-1 rounded text-sm text-gray-200 hover:bg-gray-600 transition-colors"
                      >
                        {g}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tema */}
              {comic.tema && comic.tema.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-white mb-2">Tema:</h3>
                  <div className="flex flex-wrap gap-2">
                    {comic.tema.map((t, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 px-3 py-1 rounded text-sm text-gray-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sinopsis */}
              <div className="mt-6">
                <h3 className="font-semibold text-white mb-2">Sinopsis:</h3>
                <p className="text-gray-300 whitespace-pre-line">
                  {comic.sinopsis ||
                    comic.short_sinopsis ||
                    "Tidak ada sinopsis tersedia."}
                </p>
              </div>
            </div>
          </div>

          {/* Daftar Chapter */}
          {comic.chapter && comic.chapter.length > 0 && (
            <div className="p-6 border-t border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Chapters:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comic.chapter.map((chapter, index) => {
                  // Bersihkan URL chapter juga, hapus trailing slash jika ada
                  let chapterUrl = chapter.url;
                  if (chapterUrl.endsWith("/")) {
                    chapterUrl = chapterUrl.slice(0, -1);
                  }

                  return (
                    <Link
                      key={index}
                      href={`/baca/${encodeURIComponent(chapterUrl)}`}
                      className="bg-gray-700 p-3 rounded flex justify-between items-center hover:bg-gray-600 transition-colors"
                    >
                      <span className="text-white">{chapter.chapter}</span>
                      <span className="text-gray-400 text-sm">
                        {chapter.update}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Komik Serupa */}
          {comic.mirip && comic.mirip.length > 0 && (
            <div className="p-6 border-t border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">
                Komik Serupa:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {comic.mirip.map((similar, index) => {
                  // Bersihkan URL komik serupa juga
                  let similarUrl = similar.url;
                  if (similarUrl.endsWith("/")) {
                    similarUrl = similarUrl.slice(0, -1);
                  }

                  return (
                    <div
                      key={index}
                      className="bg-gray-700 rounded-lg shadow overflow-hidden"
                    >
                      <Link href={`/detail/${encodeURIComponent(similarUrl)}`}>
                        <div className="relative h-48 w-full">
                          <Image
                            src={similar.img || "/placeholder.jpg"}
                            alt={similar.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.jpg";
                            }}
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-white truncate">
                            {similar.title}
                          </h4>
                          {similar.jenis && (
                            <p className="text-sm text-gray-400 mt-1">
                              {similar.jenis}
                            </p>
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
