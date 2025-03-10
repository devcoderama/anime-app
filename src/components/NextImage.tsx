// components/NextImage.tsx
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";

interface NextImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const NextImage: React.FC<NextImageProps> = ({
  src,
  alt,
  className = "",
  priority = false,
  onLoad,
  onError,
}) => {
  // State untuk menyimpan URL gambar saat ini
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [errorCount, setErrorCount] = useState<number>(0);
  const placeholderImage = "/placeholder.jpg";

  // Reset imgSrc jika prop src berubah
  useEffect(() => {
    setImgSrc(src);
    setErrorCount(0);
  }, [src]);

  // Handler untuk error gambar
  const handleImageError = () => {
    console.log(`Error loading image (${errorCount}): ${alt}`);

    // Penting: verifikasi apakah ini sudah URL proxy atau URL asli
    if (errorCount === 0) {
      // Jika URL asli, dan ternyata URL proxy, ambil URL aslinya
      if (src.startsWith("/api/")) {
        console.log("URL sudah di-proxy, mencoba alternatif");
        const params = new URLSearchParams(src.split("?")[1]);
        const originalUrl = params.get("url");
        if (originalUrl) {
          // Coba dengan proxy alternatif langsung ke URL asli
          setImgSrc(`/api/imageproxy?url=${encodeURIComponent(originalUrl)}`);
        } else {
          // Gunakan placeholder jika tidak bisa mengekstrak URL asli
          setImgSrc(placeholderImage);
        }
      } else {
        // Coba dengan proxy standar
        console.log(`Trying proxy for: ${alt}`);
        setImgSrc(`/api/imageproxy?url=${encodeURIComponent(src)}`);
      }
      setErrorCount(1);
    } else if (errorCount === 1) {
      // Gunakan gambar placeholder sebagai fallback terakhir
      console.log(`Using placeholder for: ${alt}`);
      setImgSrc(placeholderImage);
      setErrorCount(2);
    }

    // Panggil callback onError jika ada
    if (onError) {
      onError();
    }
  };

  // Handler untuk pemuatan gambar berhasil
  const handleImageLoad = () => {
    console.log(`Image loaded successfully: ${alt}`);
    if (onLoad) {
      onLoad();
    }
  };

  return (
    <div className={`relative ${className}`} style={{ minHeight: "200px" }}>
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-auto"
        loading={priority ? "eager" : "lazy"}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ objectFit: "contain", maxWidth: "100%" }}
      />
    </div>
  );
};
