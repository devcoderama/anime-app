"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import ComicCard from "@/components/pages/ComicCard";
import Link from "next/link";
import { Comic, latestComicsData } from "@/data/staticData";

// URL API
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://laravel-api-manga-scraper.vercel.app/api/api";

// Komponen Pagination
const Pagination = ({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) => {
  // Array dengan nomor halaman yang akan ditampilkan
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Jika total halaman kurang dari yang ditampilkan, tampilkan semua
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Selalu sertakan halaman pertama
      pages.push(1);

      // Hitung awal dan akhir rentang halaman di sekitar halaman saat ini
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Tambahkan elipsis setelah halaman pertama jika diperlukan
      if (start > 2) {
        pages.push("...");
      }

      // Tambahkan halaman di sekitar halaman saat ini
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Tambahkan elipsis sebelum halaman terakhir jika diperlukan
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Selalu sertakan halaman terakhir
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex space-x-1">
        {currentPage > 1 && (
          <Link
            href={`/berwarna/${currentPage - 1}`}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Sebelumnya
          </Link>
        )}

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-300">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={`/berwarna/${page}`}
              className={`px-4 py-2 rounded ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {page}
            </Link>
          )
        )}

        {currentPage < totalPages && (
          <Link
            href={`/berwarna/${currentPage + 1}`}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Selanjutnya
          </Link>
        )}
      </div>
    </div>
  );
};

export default function BerwarnaPage() {
  const params = useParams();
  const pageNumber = parseInt(params.page as string) || 1;

  // Filter komik berwarna dari data statis sebagai fallback
  const filteredStaticData = latestComicsData.filter(
    (comic) => comic.jenis === "Warna"
  );

  const [comics, setComics] = useState<Comic[]>(filteredStaticData);
  const [currentPage, setCurrentPage] = useState<number>(pageNumber);
  const [totalPages, setTotalPages] = useState<number>(194);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColoredComics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/berwarna/${pageNumber}`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setComics(data.data.data);
          setCurrentPage(parseInt(data.data.current_page));
          setTotalPages(parseInt(data.data.total_page));
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching colored comics:", error);
        setError("Gagal mengambil data komik. Menggunakan data offline.");
        // Tetap menggunakan data statis yang difilter jika fetch gagal
      } finally {
        setIsLoading(false);
      }
    };

    fetchColoredComics();
  }, [pageNumber]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Komik Berwarna</h1>
          <span className="text-gray-400">
            Halaman {currentPage} dari {totalPages}
          </span>
        </div>

        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(20)].map((_, index) => (
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
                    key={`colored-${index}-${comic.link}`}
                    comic={comic}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">
                  Tidak ada komik berwarna yang ditemukan
                </p>
              </div>
            )}
          </>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </Layout>
  );
}
