// components/NextImage.tsx
import React from "react";
import Image from "next/image";

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
  // Menggunakan fillnya untuk menyesuaikan image dengan container
  // Perhatikan: parent element harus memiliki position: relative
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ minHeight: "200px" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "contain" }}
        priority={priority}
        onLoad={onLoad}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={(e) => {
          // Jika terjadi error, tampilkan gambar placeholder
          const imgElement = e.target as HTMLImageElement;
          if (imgElement.src !== "/placeholder.jpg") {
            imgElement.src = "/placeholder.jpg";
          }

          if (onError) {
            onError();
          }
        }}
      />
    </div>
  );
};
