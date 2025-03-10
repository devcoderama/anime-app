import React from "react";
import Image from "next/image";
import Link from "next/link";

// Interface untuk properti komik
interface Comic {
  link: string;
  title: string;
  ratting: string;
  jenis: string;
  view?: string;
  type?: string;
  status?: string;
  chapter?: string;
  last_update?: string;
  img: string;
}

interface ComicCardProps {
  comic: Comic;
}

const ComicCard: React.FC<ComicCardProps> = ({ comic }) => {
  // Fungsi untuk memastikan URL gambar valid
  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder.jpg";
    // Pastikan URL dimulai dengan http atau https
    if (!url.startsWith("http")) {
      return `https:${url}`;
    }
    return url;
  };

  // Ekstrak ID dari link untuk digunakan dalam routing
  const getComicId = (link: string) => {
    // Hapus trailing slash jika ada
    const cleanLink = link.endsWith("/") ? link.slice(0, -1) : link;
    // Ambil segmen terakhir dari URL sebagai ID
    const segments = cleanLink.split("/");
    return segments[segments.length - 1];
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 border border-gray-700 hover:border-gray-600">
      <Link href={`/detail/${encodeURIComponent(comic.link)}`}>
        <div className="relative h-56 w-full">
          <Image
            src={getImageUrl(comic.img)}
            alt={comic.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover transition-opacity hover:opacity-75"
            priority={false}
            // Fallback jika gambar gagal dimuat
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.jpg";
            }}
          />
          {comic.type && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
              {comic.type}
            </span>
          )}
          {comic.status && (
            <span
              className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${
                comic.status.toLowerCase().includes("ongoing")
                  ? "bg-green-600"
                  : comic.status.toLowerCase().includes("completed")
                  ? "bg-blue-600"
                  : "bg-yellow-600"
              }`}
            >
              {comic.status}
            </span>
          )}
          {/* Overlay gradient untuk membuat teks lebih mudah dibaca */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-900 to-transparent"></div>
          {/* Rating di pojok kiri bawah */}
          <div className="absolute bottom-2 left-2 flex items-center bg-gray-900 bg-opacity-75 rounded px-1.5 py-0.5">
            <svg
              className="w-3.5 h-3.5 text-yellow-400 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span className="text-xs font-medium text-white">
              {comic.ratting}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-white truncate">{comic.title}</h3>
          <div className="mt-2 flex justify-between text-sm text-gray-400">
            <span>{comic.jenis}</span>
          </div>
          {comic.chapter && (
            <div className="mt-2 text-sm text-gray-300">
              <div className="flex justify-between items-center">
                <p>Ch: {comic.chapter}</p>
                {comic.last_update && (
                  <span className="text-xs text-gray-500">
                    {comic.last_update}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ComicCard;
