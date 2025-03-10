"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DesktopNavbar from "@/components/Layout/DesktopNavbar";
import MobileSidebar from "@/components/Layout/MobileSidebar";

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Effect for scroll detection without changing layout
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Shared search handler for both desktop and mobile
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search/${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      // Close sidebar on search (for mobile)
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Fixed height placeholder to prevent content jump */}
      <div className="h-[calc(4rem+1px)]"></div>

      {/* Fixed navbar - absolute top-0 ensures no gap */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full m-0 p-0">
        {/* Accent line at top */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-1 w-full"></div>

        <nav className="bg-gray-800 border-b border-gray-700 shadow-lg w-full">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Desktop Navbar - Hidden on mobile */}
              <DesktopNavbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                scrolled={scrolled}
              />

              {/* Mobile Sidebar - Hidden on desktop */}
              <MobileSidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                scrolled={scrolled}
              />
            </div>
          </div>

          {/* Subtle shadow/border when scrolled */}
          <div
            className={`h-[1px] w-full ${
              scrolled
                ? "bg-gradient-to-r from-transparent via-gray-600 to-transparent"
                : ""
            } transition-all duration-300`}
          ></div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
