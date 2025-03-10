"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import { Book, AlertTriangle, Tag, TrendingUp } from "lucide-react";

// URL API
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://laravel-api-manga-scraper.vercel.app/api/api";

// Genre default jika API gagal
const DEFAULT_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

// Mapping genre ke ikon
const GENRE_ICONS: Record<string, React.ReactNode> = {
  Action: <TrendingUp size={18} />,
  Adventure: <Book size={18} />,
  // Tambahkan ikon lainnya sesuai kebutuhan
};

export default function GenresPage() {
  const [genres, setGenres] = useState<string[]>(DEFAULT_GENRES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/genre`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setGenres(data.data);
        } else {
          throw new Error("Failed to fetch genres");
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Gagal mengambil data genre. Menggunakan data default.");
        // Tetap menggunakan data default jika fetch gagal
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // Fungsi untuk mendapatkan warna latar belakang untuk genre
  const getRandomColor = (index: number) => {
    const colors = [
      "bg-blue-600 hover:bg-blue-700",
      "bg-purple-600 hover:bg-purple-700",
      "bg-green-600 hover:bg-green-700",
      "bg-rose-600 hover:bg-rose-700",
      "bg-amber-600 hover:bg-amber-700",
      "bg-emerald-600 hover:bg-emerald-700",
      "bg-cyan-600 hover:bg-cyan-700",
      "bg-indigo-600 hover:bg-indigo-700",
      "bg-lime-600 hover:bg-lime-700",
      "bg-fuchsia-600 hover:bg-fuchsia-700",
    ];
    return colors[index % colors.length];
  };

  // Fungsi untuk mendapatkan ikon berdasarkan genre
  const getGenreIcon = (genre: string) => {
    return GENRE_ICONS[genre] || <Tag size={18} />;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Jelajahi Genre</h1>
        <p className="text-gray-400 mb-8">
          Temukan manga berdasarkan kategori yang Anda sukai
        </p>

        {error && (
          <div className="bg-red-900/80 backdrop-blur-sm text-white p-4 rounded-lg mb-6 flex items-center space-x-2 animate-fade-in">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(15)].map((_, index) => (
              <div
                key={index}
                className="h-20 bg-gray-800/60 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {genres.map((genre, index) => (
              <Link
                key={index}
                href={`/genre/${encodeURIComponent(genre)}/1`}
                className={`
                  ${getRandomColor(index)} 
                  text-white p-4 rounded-lg 
                  transition-all duration-300
                  hover:shadow-lg hover:shadow-blue-800/20
                  hover:scale-105 
                  flex flex-col items-center justify-center 
                  h-24 relative overflow-hidden
                  group
                `}
              >
                {/* Background animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Icon */}
                <div className="mb-2 transform group-hover:scale-125 transition-transform duration-300">
                  {getGenreIcon(genre)}
                </div>

                {/* Genre name */}
                <span className="font-medium">{genre}</span>

                {/* Animated indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="mt-12 flex items-center justify-center">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full border-r-2 border-l-2 border-purple-500 animate-spin animate-delay-150"></div>
              </div>
            </div>
            <span className="ml-3 text-gray-400">
              Scroll untuk melihat lebih banyak
            </span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </Layout>
  );
}
