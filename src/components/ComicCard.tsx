// components/ComicCard.tsx
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
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg shadow-black/20">
      <Link href={`/detail/${slug}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          {/* Menggunakan Next.js Image component untuk optimasi */}
          <Image
            src={proxyImageUrl}
            alt={comic.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            loading="lazy"
          />

          {/* Badge untuk jenis komik (warna/tidak) */}
          {comic.jenis && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              {comic.jenis}
            </div>
          )}

          {/* Badge untuk chapter terbaru */}
          {comic.chapter && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/0 p-2">
              <span className="text-white text-sm font-medium">
                {comic.chapter}
              </span>
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="text-white font-medium line-clamp-2 h-12 text-sm">
            {comic.title}
          </h3>

          <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
            {/* Tipe komik (Manga/Manhwa/Manhua) */}
            <span>{comic.type?.trim() || "Manga"}</span>

            {/* Update terakhir */}
            <span>{comic.last_update || "N/A"}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ComicCard;
