// components/DirectImage.tsx
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

interface DirectImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * DirectImage - Komponen gambar sederhana yang mencoba langsung dari URL asli
 * dan menggunakan placeholder jika gagal.
 */
const DirectImage: React.FC<DirectImageProps> = ({
  src,
  alt,
  className = "",
  priority = false,
  onLoad,
  onError,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);
  const placeholderImage = "/placeholder.jpg";

  // Tangani error image
  const handleError = () => {
    // Hindari loop infinite - jika sudah menggunakan placeholder, jangan ubah lagi
    if (!hasError) {
      console.log(`Image error for: ${alt}, using placeholder`);
      setImgSrc(placeholderImage);
      setHasError(true);

      // Panggil callback onError jika ada
      if (onError) {
        onError();
      }
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      onError={handleError}
      onLoad={onLoad}
      style={{
        objectFit: "cover",
        maxWidth: "100%",
        height: className?.includes("h-") ? undefined : "auto",
      }}
    />
  );
};

export default DirectImage;
