"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Comic, latestComicsData, popularComicsData } from "@/data/staticData";

// URL API
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://laravel-api-manga-scraper.vercel.app/api/api";

// Definisikan tipe data untuk context
interface ComicContextType {
  latestComics: Comic[];
  popularComics: Comic[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

// Buat context dengan nilai default
const ComicContext = createContext<ComicContextType>({
  latestComics: [],
  popularComics: [],
  isLoading: true,
  error: null,
  refreshData: async () => {},
});

// Hook untuk menggunakan context
export const useComics = () => useContext(ComicContext);

// Props untuk FetchProvider
interface FetchProviderProps {
  children: ReactNode;
}

// Provider component
export const FetchProvider: React.FC<FetchProviderProps> = ({ children }) => {
  const [latestComics, setLatestComics] = useState<Comic[]>(latestComicsData);
  const [popularComics, setPopularComics] =
    useState<Comic[]>(popularComicsData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk fetch data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch latest comics
      const latestResponse = await fetch(`${API_URL}/terbaru/1`);
      if (!latestResponse.ok) {
        throw new Error(
          `API error fetching latest comics: ${latestResponse.status}`
        );
      }
      const latestData = await latestResponse.json();
      if (latestData.success) {
        setLatestComics(latestData.data.data);
      }

      // Fetch popular comics
      const popularResponse = await fetch(`${API_URL}/popular`);
      if (!popularResponse.ok) {
        throw new Error(
          `API error fetching popular comics: ${popularResponse.status}`
        );
      }
      const popularData = await popularResponse.json();
      if (popularData.success) {
        setPopularComics(popularData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
      // Tetap menggunakan data statis jika gagal
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Nilai yang akan dishare melalui context
  const value = {
    latestComics,
    popularComics,
    isLoading,
    error,
    refreshData: fetchData,
  };

  return (
    <ComicContext.Provider value={value}>{children}</ComicContext.Provider>
  );
};
