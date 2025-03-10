"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface DesktopNavbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  scrolled: boolean;
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  scrolled,
}) => {
  const [activeItem, setActiveItem] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const menuItems = [
    {
      name: "Home",
      path: "/",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      name: "Terbaru",
      path: "/terbaru/1",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      name: "Popular",
      path: "/popular",
      icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    },
    {
      name: "Berwarna",
      path: "/berwarna/1",
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      name: "Genre",
      path: "/genres",
      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    },
  ];

  return (
    <div className="hidden md:flex items-center justify-between w-full">
      {/* Logo and navigation links */}
      <div className="flex items-center">
        <Link
          href="/"
          className="flex items-center group"
          onMouseEnter={() => setActiveItem("")}
          onClick={() => setActiveItem("")}
        >
          <div className="relative w-8 h-8 mr-2 overflow-hidden">
            <div className="absolute inset-0 bg-blue-600 rounded-full transition-transform duration-300 group-hover:scale-110"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110"
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
            </div>
          </div>
          <span
            className={`text-xl font-bold text-white transition-all duration-300 ${
              scrolled ? "scale-90" : ""
            }`}
          >
            Komik-App
          </span>
        </Link>

        <div className="flex ml-8 space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="group relative"
              onMouseEnter={() => setActiveItem(item.name)}
              onClick={() => setActiveItem(item.name)}
            >
              <div className="flex items-center py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 mr-1.5 transition-colors duration-300 ${
                    activeItem === item.name
                      ? "text-blue-400"
                      : "text-gray-400 group-hover:text-gray-300"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    activeItem === item.name
                      ? "text-blue-400"
                      : "text-gray-300 group-hover:text-white"
                  }`}
                >
                  {item.name}
                </span>
              </div>

              {/* Animated underline */}
              <div
                className="absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-300 
                ease-out transform origin-left scale-x-0 group-hover:scale-x-100"
              ></div>

              {/* Active indicator */}
              {activeItem === item.name && (
                <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-blue-500 transform origin-center scale-x-100"></div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex">
        <div
          className={`relative transition-all duration-300 ${
            isFocused ? "w-64" : "w-56"
          }`}
        >
          <input
            type="text"
            placeholder="Cari komik..."
            className={`bg-gray-700 text-white w-full px-4 py-2 pr-10 rounded-full 
              focus:outline-none transition-all duration-300 ${
                isFocused
                  ? "ring-2 ring-blue-500 bg-gray-600"
                  : "hover:bg-gray-600"
              }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className="absolute right-0 top-0 h-full px-3 flex items-center justify-center">
            <button
              type="submit"
              className={`transition-colors duration-300 ${
                isFocused ? "text-blue-400" : "text-gray-400 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Animated border for search box */}
          {isFocused && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-blue-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </form>
    </div>
  );
};

export default DesktopNavbar;
