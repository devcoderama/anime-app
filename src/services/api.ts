// API Service untuk Komik-App
// File ini berisi fungsi-fungsi untuk interaksi dengan API komik

// Tipe data untuk komik
export interface Comic {
  link: string;
  title: string;
  ratting: string | null;
  jenis: string | null;
  view: string | null;
  type: string | null;
  status: string | null;
  chapter: string | null;
  last_update: string | null;
  img: string;
}

// URL API default
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://laravel-api-manga-scraper.vercel.app/api/api";

/**
 * Fungsi untuk mengambil data komik terbaru
 * @param page Nomor halaman
 * @returns Array data komik terbaru dan metadata halaman
 */
export async function getLatestComics(page: number = 1): Promise<{
  comics: Comic[];
  currentPage: string;
  totalPage: string;
}> {
  try {
    const response = await fetch(`${API_URL}/terbaru/${page}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return {
        comics: data.data.data,
        currentPage: data.data.current_page,
        totalPage: data.data.total_page,
      };
    }

    return { comics: [], currentPage: "1", totalPage: "1" };
  } catch (error) {
    console.error("Error fetching latest comics:", error);
    return { comics: [], currentPage: "1", totalPage: "1" };
  }
}

/**
 * Fungsi untuk mengambil data komik populer
 * @returns Array data komik populer
 */
export async function getPopularComics(): Promise<Comic[]> {
  try {
    const response = await fetch(`${API_URL}/popular`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching popular comics:", error);
    return [];
  }
}

/**
 * Fungsi untuk mengambil data komik berwarna
 * @param page Nomor halaman
 * @returns Array data komik berwarna dan metadata halaman
 */
export async function getColoredComics(page: number = 1): Promise<{
  comics: Comic[];
  currentPage: string;
  totalPage: string;
}> {
  try {
    const response = await fetch(`${API_URL}/berwarna/${page}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return {
        comics: data.data.data,
        currentPage: data.data.current_page,
        totalPage: data.data.total_page,
      };
    }

    return { comics: [], currentPage: "1", totalPage: "1" };
  } catch (error) {
    console.error("Error fetching colored comics:", error);
    return { comics: [], currentPage: "1", totalPage: "1" };
  }
}

/**
 * Fungsi untuk mengambil daftar genre
 * @returns Array daftar genre
 */
export async function getGenres(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL}/genre`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

/**
 * Fungsi untuk mengambil data komik berdasarkan genre
 * @param genre Nama genre
 * @param page Nomor halaman
 * @returns Array data komik berdasarkan genre dan metadata halaman
 */
export async function getComicsByGenre(
  genre: string,
  page: number = 1
): Promise<{
  comics: Comic[];
  currentPage: string;
  totalPage: string;
}> {
  try {
    const response = await fetch(`${API_URL}/genre/${genre}/${page}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return {
        comics: data.data.data,
        currentPage: data.data.current_page,
        totalPage: data.data.total_page,
      };
    }

    return { comics: [], currentPage: "1", totalPage: "1" };
  } catch (error) {
    console.error(`Error fetching comics by genre ${genre}:`, error);
    return { comics: [], currentPage: "1", totalPage: "1" };
  }
}

/**
 * Fungsi untuk mencari komik berdasarkan kata kunci
 * @param keyword Kata kunci pencarian
 * @returns Array hasil pencarian komik
 */
export async function searchComics(keyword: string): Promise<Comic[]> {
  try {
    const response = await fetch(
      `${API_URL}/search/${encodeURIComponent(keyword)}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error(`Error searching comics with keyword ${keyword}:`, error);
    return [];
  }
}

/**
 * Fungsi untuk mengambil detail komik
 * @param id Link komik
 * @returns Detail komik
 */
export async function getComicDetail(id: string) {
  try {
    const response = await fetch(`${API_URL}/detail/${id}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error fetching comic detail for ${id}:`, error);
    return null;
  }
}

/**
 * Fungsi untuk membaca komik (mendapatkan gambar chapter)
 * @param id Link chapter
 * @returns Data baca komik
 */
export async function getReadingContent(id: string) {
  try {
    const response = await fetch(`${API_URL}/baca/${id}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error(`Error fetching reading content for ${id}:`, error);
    return null;
  }
}
