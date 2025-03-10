// components/pages/ComicCard.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Comic } from "@/types/comic";

interface ComicCardProps {
  comic: Comic;
}

const ComicCard: React.FC<ComicCardProps> = ({ comic }) => {
  // Mengambil slug dari link (menghapus slash di akhir jika ada)
  const slug = comic.link.endsWith("/") ? comic.link.slice(0, -1) : comic.link;

  // Untuk gambar, gunakan proxy image untuk mengatasi masalah CORS
  const proxyImageUrl = `/api/image?url=${encodeURIComponent(comic.img)}`;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-105 hover:shadow-blue-900/20">
      <Link href={`/komik/${slug}`}>
        <div className="relative">
          {/* Gambar Thumbnail */}
          <div className="relative aspect-[2/3] bg-gray-700">
            <Image
              src={proxyImageUrl}
              alt={comic.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              loading="lazy"
            />
          </div>

          {/* Badge jenis komik (jika ada) */}
          {comic.jenis && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              {comic.jenis}
            </span>
          )}

          {/* Chapter terbaru */}
          {comic.chapter && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2">
              <span className="text-white text-sm">{comic.chapter}</span>
            </div>
          )}
        </div>

        <div className="p-3">
          {/* Judul komik dengan batasan tinggi */}
          <h3 className="font-medium text-white text-sm line-clamp-2 min-h-[2.5rem]">
            {comic.title}
          </h3>

          {/* Info tambahan */}
          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>{comic.type?.trim() || "Manga"}</span>
            {comic.last_update && <span>{comic.last_update}</span>}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ComicCard;
