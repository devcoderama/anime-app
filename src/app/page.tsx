"use client";

import Image from "next/image";
import Link from "next/link";
import ComicCard from "@/components/pages/ComicCard";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { Comic, latestComicsData, popularComicsData } from "@/data/staticData";

// URL API
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://laravel-api-manga-scraper.vercel.app/api/api";

// Komponen Home dengan client-side data fetching
export default function Home() {
  const [latestComics, setLatestComics] = useState<Comic[]>(latestComicsData);
  const [popularComics, setPopularComics] =
    useState<Comic[]>(popularComicsData);
  const [isLoading, setIsLoading] = useState(true);
  const [animateHero, setAnimateHero] = useState(false);

  // Fungsi untuk mengambil data komik terbaru
  const fetchLatestComics = async () => {
    try {
      const response = await fetch(`${API_URL}/terbaru/1`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setLatestComics(data.data.data);
      }
    } catch (error) {
      console.error("Error fetching latest comics:", error);
      // Tetap menggunakan data statis jika terjadi error
    }
  };

  // Fungsi untuk mengambil data komik populer
  const fetchPopularComics = async () => {
    try {
      const response = await fetch(`${API_URL}/popular`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setPopularComics(data.data);
      }
    } catch (error) {
      console.error("Error fetching popular comics:", error);
      // Tetap menggunakan data statis jika terjadi error
    }
  };

  // Mengambil data saat komponen di-mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Mengambil data secara paralel
        await Promise.all([fetchLatestComics(), fetchPopularComics()]);
      } catch (error) {
        console.error("Error fetching comics:", error);
      } finally {
        setIsLoading(false);
        // Trigger animasi hero section setelah loading selesai
        setTimeout(() => setAnimateHero(true), 300);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section dengan Animasi */}
        <section
          className={`mb-12 transition-all duration-1000 ease-out transform ${
            animateHero
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl overflow-hidden shadow-xl">
            <div className="relative">
              {/* Pola Dekoratif */}
              <div className="absolute inset-0 opacity-10">
                <svg
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="white"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <div className="md:flex items-center p-6 md:p-8 relative z-10">
                <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
                    Temukan Komik Favorit Anda
                  </h2>
                  <p className="text-white text-lg mb-6 drop-shadow">
                    Nikmati ribuan judul komik dari berbagai genre seperti
                    action, romance, fantasy, dan banyak lagi. Dengan Komik-App,
                    Anda bisa membaca komik favorit kapan saja dan di mana saja.
                  </p>
                  <div className="flex space-x-4">
                    <Link
                      href="/terbaru/1"
                      className="group bg-white text-purple-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 flex items-center"
                    >
                      <span>Mulai Membaca</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                    <Link
                      href="/genres"
                      className="group bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-purple-600 transition-all duration-300 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                      <span>Jelajahi Genre</span>
                    </Link>
                  </div>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <div className="relative w-48 h-64 md:w-56 md:h-72 transform hover:scale-105 transition-transform duration-500">
                    {/* Efek Bayangan Animasi */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg transform rotate-3 animate-pulse"></div>
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg transform -rotate-3 animate-pulse"></div>
                    <div className="absolute inset-0 bg-white rounded-lg shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-indigo-500/50">
                      {!isLoading && popularComics.length > 0 ? (
                        <Image
                          src={popularComics[0].img}
                          alt="Featured Comic"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 192px, 224px"
                          priority
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-gray-400 animate-pulse"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Komik Populer Section */}
        <section className="mb-12 animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              Komik Populer
            </h2>
            <Link
              href="/popular"
              className="group text-blue-400 hover:text-blue-300 transition-colors flex items-center"
            >
              <span>Lihat Semua</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg overflow-hidden animate-pulse"
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {popularComics.slice(0, 5).map((comic, index) => (
                <div
                  key={`popular-${index}-${comic.link}`}
                  className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ComicCard comic={comic} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Update Terbaru Section */}
        <section
          className="mb-12 animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Update Terbaru
            </h2>
            <Link
              href="/terbaru/1"
              className="group text-blue-400 hover:text-blue-300 transition-colors flex items-center"
            >
              <span>Lihat Semua</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg overflow-hidden animate-pulse"
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {latestComics.slice(0, 10).map((comic, index) => (
                <div
                  key={`latest-${index}-${comic.link}`}
                  className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                >
                  <ComicCard comic={comic} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section
          className="mt-12 bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg transform transition-all duration-500 hover:shadow-indigo-500/25 animate-fadeIn"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-indigo-400 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h2 className="text-2xl font-bold text-white">
              Selamat Datang di Komik-App
            </h2>
          </div>
          <p className="text-gray-300 mb-6 pl-11">
            Jelajahi koleksi komik terlengkap dengan berbagai genre dan tipe.
            Baca komik favorit Anda kapan saja dan di mana saja.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-11">
            <div className="bg-gray-700 p-4 rounded-lg transition-all duration-300 hover:bg-gray-600 hover:shadow-md flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">
                Beragam Genre
              </h3>
              <p className="text-gray-300 text-center">
                Temukan komik dari berbagai genre yang menarik
              </p>
              <Link
                href="/genres"
                className="mt-4 text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                Jelajahi Genre →
              </Link>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg transition-all duration-300 hover:bg-gray-600 hover:shadow-md flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">
                Update Terbaru
              </h3>
              <p className="text-gray-300 text-center">
                Selalu dapatkan komik terbaru setiap hari
              </p>
              <Link
                href="/terbaru/1"
                className="mt-4 text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                Lihat Terbaru →
              </Link>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg transition-all duration-300 hover:bg-gray-600 hover:shadow-md flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">
                Komik Berwarna
              </h3>
              <p className="text-gray-300 text-center">
                Nikmati tampilan yang lebih menarik dengan komik berwarna
              </p>
              <Link
                href="/berwarna/1"
                className="mt-4 text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                Lihat Berwarna →
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Style untuk animasi custom */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </Layout>
  );
}
