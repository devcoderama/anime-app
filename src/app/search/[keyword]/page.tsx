"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import ComicCard from "@/components/pages/ComicCard";
import Link from "next/link";
import { Comic } from "@/data/staticData";

// URL API
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://laravel-api-manga-scraper.vercel.app/api/api";

export default function SearchPage() {
  const params = useParams();
  const keyword = params.keyword as string;

  const [comics, setComics] = useState<Comic[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/search/${encodeURIComponent(keyword)}`
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setComics(data.data);
        } else {
          throw new Error("Failed to fetch search results");
        }
      } catch (error) {
        console.error(`Error searching for "${keyword}":`, error);
        setError("Gagal melakukan pencarian.");
      } finally {
        setIsLoading(false);
      }
    };

    if (keyword) {
      fetchSearchResults();
    }
  }, [keyword]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Hasil Pencarian: <span className="text-blue-400">{keyword}</span>
        </h1>

        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

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
          <>
            {comics.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {comics.map((comic, index) => (
                  <ComicCard
                    key={`search-${index}-${comic.link}`}
                    comic={comic}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Tidak Ditemukan
                </h2>
                <p className="text-gray-400 mb-6">
                  Tidak ada komik yang ditemukan untuk kata kunci "{keyword}".
                </p>
                <Link
                  href="/"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
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
