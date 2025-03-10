"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ChevronRight, Eye } from "lucide-react";
import ComicCard from "@/components/pages/ComicCard";
import { Comic, popularComicsData } from "@/data/staticData";

// URL API
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://laravel-api-manga-scraper.vercel.app/api/api";

export default function Recommendations() {
  const [comics, setComics] = useState<Comic[]>(popularComicsData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularComics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/popular`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setComics(data.data);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching popular comics:", error);
        setError("Gagal mengambil data komik. Menggunakan data offline.");
        // Tetap menggunakan data statis jika fetch gagal
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularComics();
  }, []);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
          Rekomendasi Untuk Anda
        </h2>
        <Link
          href="/popular"
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center transition-colors"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {error && (
        <div className="bg-red-900 text-white p-4 rounded-lg mb-6">{error}</div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800/60 rounded-xl shadow-lg overflow-hidden group hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 transform"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              <div className="p-3">
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {comics.map((comic, index) => (
            <ComicCard key={`popular-${index}-${comic.link}`} comic={comic} />
          ))}
        </div>
      )}
    </div>
  );
}
