# Komik-App

Aplikasi web untuk membaca komik online berbasis Next.js dengan menggunakan API komik.

## Deskripsi Proyek

Komik-App adalah aplikasi web yang memungkinkan pengguna untuk mencari, menelusuri, dan membaca komik online. Aplikasi ini dibangun menggunakan framework Next.js dan menggunakan API eksternal untuk mengambil data komik.

## Fitur Utama

- **Halaman Utama**: Menampilkan komik populer dan komik terbaru
- **Komik Terbaru**: Halaman untuk menjelajahi komik-komik dengan update terbaru
- **Komik Populer**: Halaman untuk melihat komik-komik yang paling populer
- **Komik Berwarna**: Halaman khusus untuk komik berwarna
- **Pencarian**: Fungsi pencarian untuk menemukan komik berdasarkan judul
- **Filter Genre**: Menelusuri komik berdasarkan genre tertentu
- **Detail Komik**: Halaman detail yang menampilkan informasi lengkap tentang komik dan daftar chapter
- **Pembaca Komik**: Fitur untuk membaca komik per chapter dengan navigasi halaman

## Teknologi yang Digunakan

- **Next.js**: Framework React dengan fitur server-side rendering
- **Tailwind CSS**: Framework CSS untuk desain responsif
- **API Komik**: Menggunakan API dari `https://laravel-api-manga-scraper.vercel.app/api/api`

## Struktur Direktori

```
komik-app/
│
├── .env.local                     # Variabel lingkungan
├── next.config.js                 # Konfigurasi Next.js
├── package.json                   # Dependencies proyek
│
├── public/                        # File statis
│   ├── favicon.ico                # Favicon
│   └── placeholder.jpg            # Gambar placeholder untuk komik tanpa gambar
│
├── src/
│   ├── components/                # Komponen UI yang dapat digunakan kembali
│   │   ├── ComicCard.js           # Komponen kartu komik (untuk daftar)
│   │   ├── Footer.js              # Komponen footer
│   │   ├── Layout.js              # Komponen layout utama
│   │   ├── Navbar.js              # Navigasi bar
│   │   └── Pagination.js          # Komponen pagination
│   │
│   ├── pages/                     # Halaman aplikasi/rute
│   │   ├── _app.js                # Komponen App khusus
│   │   ├── index.js               # Halaman utama
│   │   ├── popular.js             # Halaman komik populer
│   │   ├── genres.js              # Daftar semua genre
│   │   │
│   │   ├── terbaru/               # Komik terbaru
│   │   │   └── [page].js          # Komik terbaru berdasarkan halaman
│   │   │
│   │   ├── berwarna/              # Komik berwarna
│   │   │   └── [page].js          # Komik berwarna berdasarkan halaman
│   │   │
│   │   ├── genre/                 # Komik berdasarkan genre
│   │   │   └── [genre]/
│   │   │       └── [page].js      # Komik berdasarkan genre dan halaman
│   │   │
│   │   ├── detail/                # Detail komik
│   │   │   └── [id].js            # Halaman detail komik individual
│   │   │
│   │   ├── baca/                  # Pembaca komik
│   │   │   └── [id].js            # Halaman membaca chapter
│   │   │
│   │   └── search/                # Hasil pencarian
│   │       └── [id].js            # Halaman hasil pencarian
│   │
│   └── styles/                    # Gaya CSS
│       └── globals.css            # Gaya global
│
└── tailwind.config.js             # Konfigurasi Tailwind CSS
```

## Panduan Instalasi dan Pengaturan

### Prasyarat

- Node.js (versi 14.x atau lebih baru)
- npm atau yarn

### Langkah-langkah Instalasi

1. Clone repositori:

   ```bash
   git clone https://github.com/username/komik-app.git
   cd komik-app
   ```

2. Instal dependensi:

   ```bash
   npm install
   # atau
   yarn install
   ```

3. Buat file `.env.local` di direktori root dan tambahkan:

   ```
   NEXT_PUBLIC_API_URL=https://laravel-api-manga-scraper.vercel.app/api/api
   ```

4. Jalankan aplikasi dalam mode pengembangan:

   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. Buka browser dan akses `http://localhost:3000`

### Membangun untuk Produksi

```bash
npm run build
npm start
# atau
yarn build
yarn start
```

## Endpoint API yang Digunakan

Aplikasi ini menggunakan endpoint API berikut:

- **GET /terbaru/{page}**: Mengambil komik terbaru untuk halaman tertentu
- **GET /popular**: Mengambil komik paling populer
- **GET /berwarna/{page}**: Mengambil komik berwarna untuk halaman tertentu
- **GET /genre**: Mengambil daftar genre yang tersedia
- **GET /genre/{genre}/{page}**: Mengambil komik untuk genre dan halaman tertentu
- **GET /detail/{id}**: Mengambil detail komik berdasarkan ID
- **GET /baca/{id}**: Mengambil konten komik untuk dibaca berdasarkan ID
- **GET /search/{id}**: Mencari komik berdasarkan kata kunci

## Fitur Komponen Utama

### Layout.js

Komponen Layout berperan sebagai wrapper utama yang mencakup navbar, konten utama, dan footer. Komponen ini memastikan konsistensi tata letak di seluruh aplikasi.

### Navbar.js

Navbar berisi navigasi aplikasi dan fungsi pencarian. Pengguna dapat dengan mudah beralih antara halaman utama, komik terbaru, komik populer, dan fungsi lainnya.

### ComicCard.js

Komponen kartu yang digunakan untuk menampilkan komik dalam tata letak grid. Menampilkan informasi dasar seperti judul, rating, jenis, dan status.

### Pagination.js

Menangani navigasi halaman untuk konten yang menggunakan pagination. Menampilkan nomor halaman dan tombol navigasi untuk halaman berikutnya/sebelumnya.

## Alur Data

1. **Server-Side Rendering**:

   - Menggunakan `getServerSideProps` untuk mengambil data di sisi server
   - Pre-rendering halaman dengan data dari API untuk SEO dan performa yang lebih baik

2. **Integrasi API**:
   - Semua endpoint API dipanggil dari sisi server
   - Variabel lingkungan `NEXT_PUBLIC_API_URL` untuk URL dasar API

## Kontribusi

Kontribusi untuk meningkatkan Komik-App sangat diterima. Berikut adalah langkah-langkah untuk berkontribusi:

1. Fork repositori
2. Buat branch fitur (`git checkout -b fitur-baru`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detail.

## Kontak

Jika Anda memiliki pertanyaan atau masalah, silakan buka issue di repositori ini.

---

Dibuat dengan ❤️ menggunakan Next.js dan Tailwind CSS.
