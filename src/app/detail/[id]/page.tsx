"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Star,
  Clock,
  ChevronRight,
  Eye,
  Award,
  BookText,
  Pencil,
  Paintbrush,
  Tag,
  Palette,
  Heart,
  FileText,
  AlertCircle,
  ArrowLeft,
  Download,
  Share2,
  Bookmark,
  ThumbsUp,
  Layers,
  MessageCircle,
  Sparkles,
  Bell,
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<string>("chapters");
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [showFloatingInfo, setShowFloatingInfo] = useState<boolean>(false);

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
          // Simulasi delay untuk menampilkan animasi loading
          setTimeout(() => {
            setIsLoading(false);
          }, 800);
        } else {
          throw new Error("Failed to fetch comic details");
        }
      } catch (error) {
        console.error(`Error fetching comic detail for ${id}:`, error);
        setError("Gagal mengambil detail komik.");
        setIsLoading(false);
      }
    };

    if (id) {
      fetchComicDetail();
    }

    // Efek scroll untuk menampilkan info floating
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowFloatingInfo(true);
      } else {
        setShowFloatingInfo(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [id]);

  // Fungsi toggle bookmark
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Kondisi loading dengan animasi yang lebih menarik
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-700/50">
            <div className="md:flex animate-pulse relative">
              {/* Loading sparkles animation */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full animate-ping"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 3}s`,
                    }}
                  ></div>
                ))}
              </div>

              <div className="md:w-1/3 p-6">
                <div className="relative h-96 w-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 animate-gradient"></div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="h-4 bg-gray-700 rounded-full w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded-full w-1/2"></div>
                  <div className="h-4 bg-gray-700 rounded-full w-2/3"></div>
                  <div className="h-4 bg-gray-700 rounded-full w-3/5"></div>
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="h-8 bg-gray-700 rounded-full w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded-full w-1/2 mb-6"></div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-7 bg-gray-700 rounded-full w-20"
                    ></div>
                  ))}
                </div>
                <div className="space-y-3 mt-6">
                  <div className="h-4 bg-gray-700 rounded-full w-full"></div>
                  <div className="h-4 bg-gray-700 rounded-full w-full"></div>
                  <div className="h-4 bg-gray-700 rounded-full w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded-full w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded-full w-full"></div>
                </div>
              </div>
            </div>

            {/* Loading tabs */}
            <div className="border-t border-gray-700/50 p-4">
              <div className="flex space-x-4 overflow-x-auto pb-2">
                <div className="h-10 bg-gray-700 rounded-full w-32 flex-shrink-0"></div>
                <div className="h-10 bg-gray-700 rounded-full w-32 flex-shrink-0"></div>
                <div className="h-10 bg-gray-700 rounded-full w-32 flex-shrink-0"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-14 bg-gray-700 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Kondisi error dengan tampilan lebih menarik
  if (error || !comic) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-red-500/20">
            <div className="p-8 text-center">
              <div className="bg-red-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-500 animate-pulse" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-white bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                Komik Tidak Ditemukan
              </h1>
              <p className="mb-8 text-gray-300">
                {error ||
                  "Komik yang Anda cari tidak tersedia atau telah dihapus."}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Floating info bar when scrolling */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md transform transition-transform duration-300 ${
          showFloatingInfo ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 relative rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={comic.img || "/placeholder.jpg"}
                  alt={comic.judul}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="truncate">
                <h3 className="text-white font-bold truncate max-w-xs">
                  {comic.judul}
                </h3>
                <p className="text-gray-400 text-xs">
                  {comic.jenis || "Manga"} • {comic.status || "Ongoing"}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={toggleBookmark}
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors text-white"
              >
                {isBookmarked ? (
                  <Bookmark className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
              <Link
                href={
                  comic.chapter && comic.chapter.length > 0
                    ? `/baca/${encodeURIComponent(comic.chapter[0].url)}`
                    : "#"
                }
                className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors text-white text-sm font-medium flex items-center gap-1"
              >
                <BookOpen className="w-4 h-4" />
                <span>Baca</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-700/50 transition-all duration-300 hover:border-blue-500/30">
          <div className="md:flex relative">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 z-0 opacity-60"></div>

            {/* Bagian kiri - Gambar dan Info dasar */}
            <div className="md:w-1/3 p-6 relative z-10">
              <div className="relative">
                <div className="relative h-96 w-full group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <Image
                      src={comic.img || "/placeholder.jpg"}
                      alt={comic.judul}
                      fill
                      className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                  </div>

                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 bg-yellow-500/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg flex items-center font-bold text-sm z-20">
                    <Star className="w-4 h-4 mr-1 fill-gray-900" />
                    {comic.ratting || "N/A"}
                  </div>

                  {/* Type badge */}
                  <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm z-20 font-medium">
                    {comic.jenis || "Manga"}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex -mt-6 relative z-20 justify-center space-x-3">
                  <button
                    onClick={toggleBookmark}
                    className={`p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                      isBookmarked
                        ? "bg-yellow-500 text-gray-900"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        isBookmarked ? "fill-gray-900" : ""
                      }`}
                    />
                  </button>

                  <Link
                    href={
                      comic.chapter && comic.chapter.length > 0
                        ? `/baca/${encodeURIComponent(comic.chapter[0].url)}`
                        : "#"
                    }
                    className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg text-white font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/20"
                  >
                    <BookOpen className="w-5 h-5" />
                    Baca Sekarang
                  </Link>

                  <button className="p-3 bg-gray-700 rounded-full shadow-lg text-white hover:bg-gray-600 transition-all duration-300 transform hover:scale-110">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Info cards */}
              <div className="mt-8 space-y-4">
                <div className="bg-gray-700/50 rounded-xl p-4 backdrop-blur-sm hover:bg-gray-700/70 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-400" />
                    Informasi
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 flex items-center">
                        <Award className="w-4 h-4 mr-2 text-yellow-500" />
                        Status
                      </span>
                      <span
                        className={`text-white px-2 py-0.5 rounded-md text-sm font-medium ${
                          comic.status?.toLowerCase().includes("ongoing")
                            ? "bg-green-500/20 text-green-400"
                            : comic.status?.toLowerCase().includes("completed")
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {comic.status || "Tidak diketahui"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 flex items-center">
                        <BookText className="w-4 h-4 mr-2 text-purple-400" />
                        Tipe
                      </span>
                      <span className="text-white bg-gray-600/50 px-2 py-0.5 rounded-md text-sm">
                        {comic.jenis || "Tidak diketahui"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 flex items-center">
                        <Pencil className="w-4 h-4 mr-2 text-pink-400" />
                        Pengarang
                      </span>
                      <span className="text-white text-sm truncate max-w-[150px]">
                        {comic.pengarang || "Tidak diketahui"}
                      </span>
                    </div>

                    {comic.ilustrator && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 flex items-center">
                          <Paintbrush className="w-4 h-4 mr-2 text-indigo-400" />
                          Ilustrator
                        </span>
                        <span className="text-white text-sm truncate max-w-[150px]">
                          {comic.ilustrator}
                        </span>
                      </div>
                    )}

                    {comic.chapter && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 flex items-center">
                          <Layers className="w-4 h-4 mr-2 text-blue-400" />
                          Total Chapter
                        </span>
                        <span className="text-white bg-gray-600/50 px-2 py-0.5 rounded-md text-sm">
                          {comic.chapter.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alternatif title jika ada */}
                {comic.judul_alternatif && (
                  <div className="bg-gray-700/50 rounded-xl p-4 backdrop-blur-sm hover:bg-gray-700/70 transition-colors">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-green-400" />
                      Judul Alternatif
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {comic.judul_alternatif}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bagian kanan - Judul, genre, dan sinopsis */}
            <div className="md:w-2/3 p-6 relative z-10">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 group">
                {comic.judul}
                <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-400">
                  <Sparkles className="w-5 h-5 inline animate-pulse" />
                </span>
              </h1>

              {/* Genre & Tema dalam Card */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Genre */}
                {comic.genre && comic.genre.length > 0 && (
                  <div className="bg-gray-700/50 rounded-xl p-4 backdrop-blur-sm hover:bg-gray-700/70 transition-colors">
                    <h3 className="font-semibold text-white mb-3 flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-blue-400" />
                      Genre
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {comic.genre.map((g, index) => (
                        <Link
                          key={index}
                          href={`/genre/${encodeURIComponent(g)}/1`}
                          className="bg-gray-800/70 hover:bg-blue-600/50 px-3 py-1 rounded-full text-sm text-gray-200 hover:text-white transition-colors transform hover:scale-105 inline-flex items-center"
                        >
                          <span>{g}</span>
                          <ChevronRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tema */}
                {comic.tema && comic.tema.length > 0 && (
                  <div className="bg-gray-700/50 rounded-xl p-4 backdrop-blur-sm hover:bg-gray-700/70 transition-colors">
                    <h3 className="font-semibold text-white mb-3 flex items-center">
                      <Palette className="w-5 h-5 mr-2 text-pink-400" />
                      Tema
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {comic.tema.map((t, index) => (
                        <span
                          key={index}
                          className="bg-gray-800/70 px-3 py-1 rounded-full text-sm text-gray-200 transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sinopsis */}
              <div className="mt-6 bg-gray-700/50 rounded-xl p-5 backdrop-blur-sm hover:bg-gray-700/70 transition-colors">
                <h3 className="font-semibold text-white mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-yellow-400" />
                  Sinopsis
                </h3>
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {comic.sinopsis ||
                    comic.short_sinopsis ||
                    "Tidak ada sinopsis tersedia."}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button className="bg-gray-700/70 hover:bg-gray-700 p-3 rounded-xl flex flex-col items-center justify-center transition-colors">
                  <ThumbsUp className="w-5 h-5 text-blue-400 mb-1" />
                  <span className="text-sm text-gray-300">Suka</span>
                </button>
                <button className="bg-gray-700/70 hover:bg-gray-700 p-3 rounded-xl flex flex-col items-center justify-center transition-colors">
                  <Download className="w-5 h-5 text-green-400 mb-1" />
                  <span className="text-sm text-gray-300">Unduh</span>
                </button>
                <button className="bg-gray-700/70 hover:bg-gray-700 p-3 rounded-xl flex flex-col items-center justify-center transition-colors">
                  <Share2 className="w-5 h-5 text-purple-400 mb-1" />
                  <span className="text-sm text-gray-300">Bagikan</span>
                </button>
                <button className="bg-gray-700/70 hover:bg-gray-700 p-3 rounded-xl flex flex-col items-center justify-center transition-colors">
                  <MessageCircle className="w-5 h-5 text-yellow-400 mb-1" />
                  <span className="text-sm text-gray-300">Komentar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-t border-gray-700/50 px-4 pt-4 bg-gray-800/30">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab("chapters")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  activeTab === "chapters"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Chapters
              </button>
              <button
                onClick={() => setActiveTab("similar")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  activeTab === "similar"
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Heart className="w-4 h-4 mr-2" />
                Komik Serupa
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  activeTab === "comments"
                    ? "bg-green-600 text-white shadow-lg shadow-green-500/20"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Komentar
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 bg-gray-800/20 backdrop-blur-sm min-h-[300px]">
            {/* Daftar Chapter */}
            {activeTab === "chapters" && (
              <div className="animate-fadeIn">
                {comic.chapter && comic.chapter.length > 0 ? (
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
                          className="bg-gray-700/60 hover:bg-gray-700 group p-4 rounded-xl flex justify-between items-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 hover:scale-[1.02] transform"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/40 transition-colors">
                              <BookOpen className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="text-white font-medium">
                              {chapter.chapter}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="w-3 h-3 mr-1 text-gray-500" />
                            <span>{chapter.update}</span>
                            <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Belum Ada Chapter
                    </h3>
                    <p className="text-gray-400 text-center max-w-md">
                      Komik ini belum memiliki chapter yang tersedia. Silakan
                      cek kembali nanti.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Komik Serupa */}
            {activeTab === "similar" && (
              <div className="animate-fadeIn">
                {comic.mirip && comic.mirip.length > 0 ? (
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
                          className="bg-gray-700/60 rounded-xl shadow-lg overflow-hidden group hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 transform"
                        >
                          <Link
                            href={`/detail/${encodeURIComponent(similarUrl)}`}
                          >
                            <div className="relative h-56 w-full overflow-hidden">
                              <Image
                                src={similar.img || "/placeholder.jpg"}
                                alt={similar.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder.jpg";
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                              {/* Type badge */}
                              {similar.jenis && (
                                <div className="absolute top-2 left-2 bg-blue-600/80 text-white text-xs px-2 py-1 rounded-md">
                                  {similar.jenis}
                                </div>
                              )}
                            </div>
                            <div className="p-3 relative">
                              <h4 className="font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                                {similar.title}
                              </h4>
                              {similar.subtitle && (
                                <p className="text-xs text-gray-400 mt-1 truncate">
                                  {similar.subtitle}
                                </p>
                              )}

                              <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-4 h-4 text-blue-400" />
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                      <Heart className="w-8 h-8 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Tidak Ada Komik Serupa
                    </h3>
                    <p className="text-gray-400 text-center max-w-md">
                      Saat ini belum ada rekomendasi komik serupa untuk judul
                      ini.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Komentar Tab - Placeholder */}
            {activeTab === "comments" && (
              <div className="animate-fadeIn">
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Fitur Komentar
                  </h3>
                  <p className="text-gray-400 text-center max-w-md">
                    Fitur komentar akan segera hadir! Silakan cek kembali nanti
                    untuk berdiskusi dengan penggemar lain.
                  </p>
                  <button className="mt-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-2 transition-colors">
                    <Bell className="w-4 h-4" />
                    <span>Beritahu Saya Saat Tersedia</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom recommendations */}
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

          {/* Placeholder recommendations - Bisa diubah menjadi rekomendasi nyata */}
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
        </div>
      </div>

      {/* CSS tambahan untuk animasi */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
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
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes bell {
          0%,
          100% {
            transform: rotate(0deg);
          }
          20%,
          60% {
            transform: rotate(15deg);
          }
          40%,
          80% {
            transform: rotate(-15deg);
          }
        }
        .animate-bell {
          animation: bell 1s ease infinite;
        }
      `}</style>
    </Layout>
  );
}
