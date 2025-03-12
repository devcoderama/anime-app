import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 py-12 border-t border-gray-700 relative overflow-hidden">
      {/* Dot pattern background for visual interest */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Logo and description section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <svg
                className="h-8 w-8 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                Komik-App Coderama
              </h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Platform untuk membaca komik online terlengkap dengan berbagai
              genre dan tipe. Nikmati pengalaman membaca terbaik kapan saja dan
              di mana saja.
            </p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Komik-App Coderama. All rights
              reserved.
            </p>

            {/* Social Media Icons - Only Telegram and GitHub */}
            <div className="flex space-x-4 pt-2">
              {/* Telegram Icon with Animation */}
              <a
                href="#"
                className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-gray-800 hover:bg-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 hover:shadow-lg"
              >
                <span className="sr-only">Telegram</span>
                <svg
                  className="h-6 w-6 text-gray-400 group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></span>
              </a>

              {/* GitHub Icon with Animation */}
              <a
                href="#"
                className="group relative flex items-center justify-center h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 hover:shadow-lg"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-6 w-6 text-gray-400 group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></span>
              </a>
            </div>
          </div>

          {/* Quick Links section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-indigo-500 after:rounded-full">
              Navigasi Cepat
            </h3>
            <ul className="space-y-3">
              <li className="transform transition-transform hover:-translate-y-1 duration-300">
                <Link href="/" className="flex items-center space-x-2 group">
                  <svg
                    className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="group-hover:text-white transition-colors duration-300">
                    Home
                  </span>
                </Link>
              </li>
              <li className="transform transition-transform hover:-translate-y-1 duration-300">
                <Link
                  href="/terbaru/1"
                  className="flex items-center space-x-2 group"
                >
                  <svg
                    className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="group-hover:text-white transition-colors duration-300">
                    Komik Terbaru
                  </span>
                </Link>
              </li>
              <li className="transform transition-transform hover:-translate-y-1 duration-300">
                <Link
                  href="/popular"
                  className="flex items-center space-x-2 group"
                >
                  <svg
                    className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <span className="group-hover:text-white transition-colors duration-300">
                    Komik Populer
                  </span>
                </Link>
              </li>
              <li className="transform transition-transform hover:-translate-y-1 duration-300">
                <Link
                  href="/berwarna/1"
                  className="flex items-center space-x-2 group"
                >
                  <svg
                    className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                  <span className="group-hover:text-white transition-colors duration-300">
                    Komik Berwarna
                  </span>
                </Link>
              </li>
              <li className="transform transition-transform hover:-translate-y-1 duration-300">
                <Link
                  href="/genres"
                  className="flex items-center space-x-2 group"
                >
                  <svg
                    className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span className="group-hover:text-white transition-colors duration-300">
                    Genre
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-indigo-500 after:rounded-full">
              Tentang Kami
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Komik-App Coderama adalah platform untuk membaca komik secara
              online. Kami berusaha menyediakan pengalaman membaca komik terbaik
              dengan koleksi yang beragam dan pembaruan rutin.
            </p>
            <p className="text-gray-400">
              Kami berkomitmen untuk menyediakan konten yang beragam dan
              berkualitas tinggi untuk semua penggemar komik di Indonesia.
            </p>
          </div>
        </div>

        {/* Bottom section with decoration */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 text-center mb-2">
              Dibuat dengan ❤️ untuk pecinta komik Indonesia
            </p>
            <p className="text-sm text-gray-500">
              <Link
                href="/kebijakan-privasi"
                className="hover:text-indigo-400 transition-colors"
              >
                Kebijakan Privasi
              </Link>{" "}
              •
              <Link
                href="/syarat-ketentuan"
                className="hover:text-indigo-400 transition-colors ml-2"
              >
                Syarat & Ketentuan
              </Link>{" "}
              •
              <Link
                href="/bantuan"
                className="hover:text-indigo-400 transition-colors ml-2"
              >
                Bantuan
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative waves at the top */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-1/2 opacity-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-current text-gray-700"
          ></path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
