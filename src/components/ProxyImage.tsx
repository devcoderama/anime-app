// src/components/ProxyImage.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProxyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

const ProxyImage: React.FC<ProxyImageProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
}) => {
  const [isError, setIsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  // Function to encode URL for the proxy
  const getProxiedUrl = (originalUrl: string) => {
    const encodedUrl = encodeURIComponent(originalUrl);
    return `/api/image?url=${encodedUrl}`;
  };

  // Function to get placeholder URL with dimensions
  const getPlaceholderUrl = () => {
    return `/api/placeholder/${width}/${height}`;
  };

  // Handle image load error
  const handleError = () => {
    if (retryCount < MAX_RETRIES) {
      // Add timestamp to prevent cache usage
      const timestamp = new Date().getTime();
      const refreshedSrc = `${getProxiedUrl(src)}&t=${timestamp}`;

      // Update image src
      const imgElement = document.getElementById(
        `proxy-img-${alt.replace(/\s+/g, "-")}`
      ) as HTMLImageElement;
      if (imgElement) {
        imgElement.src = refreshedSrc;
      }

      setRetryCount(retryCount + 1);
    } else {
      setIsError(true);
    }
  };

  if (isError) {
    // Render placeholder when all retries fail
    return (
      <div
        className={`relative ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#666",
          fontSize: "14px",
          textAlign: "center",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <Image
          src={getPlaceholderUrl()}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
      </div>
    );
  }

  // Try proxied image
  return (
    <Image
      id={`proxy-img-${alt.replace(/\s+/g, "-")}`}
      src={getProxiedUrl(src)}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={priority}
    />
  );
};

export default ProxyImage;
