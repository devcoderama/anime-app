// File: /hooks/useWindowSize.js
"use client";

import { useState, useEffect } from "react";

export function useWindowSize() {
  // Nilai default yang aman untuk server-side rendering
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Handler untuk memperbarui state
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Tambahkan event listener
    window.addEventListener("resize", handleResize);

    // Panggil handler tepat setelah mounting
    handleResize();

    // Bersihkan event listener saat unmounting
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
