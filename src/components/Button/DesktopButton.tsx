// components/Button/DesktopButton.tsx
import React from "react";
import Link from "next/link";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const DesktopButton: React.FC<ButtonProps> = ({
  href,
  onClick,
  disabled = false,
  children,
  variant = "secondary",
  icon,
  iconPosition = "left",
}) => {
  // Tentukan style berdasarkan variant
  const getButtonStyle = () => {
    if (disabled) {
      return "flex items-center bg-gray-800 text-gray-500 px-4 py-3 rounded-lg opacity-60 cursor-not-allowed";
    }

    if (variant === "primary") {
      return "group flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300";
    }

    return "group flex items-center bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300";
  };

  // Tentukan animasi ikon berdasarkan posisi
  const getIconClass = (position: "left" | "right") => {
    if (disabled) return position === "left" ? "mr-2" : "ml-2";

    if (position === "left") {
      return variant === "primary"
        ? "mr-2 group-hover:animate-pulse"
        : "mr-2 transform group-hover:-translate-x-1 transition-transform duration-300";
    } else {
      return variant === "primary"
        ? "ml-2 group-hover:animate-pulse"
        : "ml-2 transform group-hover:translate-x-1 transition-transform duration-300";
    }
  };

  // Konten dengan icon
  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className={getIconClass("left")}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className={getIconClass("right")}>{icon}</span>
      )}
    </>
  );

  // Jika disabled, kembalikan button
  if (disabled) {
    return (
      <button disabled className={getButtonStyle()}>
        {content}
      </button>
    );
  }

  // Jika ada href, kembalikan Link
  if (href) {
    return (
      <Link href={href} className={getButtonStyle()}>
        {content}
      </Link>
    );
  }

  // Jika tidak ada href, kembalikan button dengan onClick
  return (
    <button onClick={onClick} className={getButtonStyle()}>
      {content}
    </button>
  );
};

export default DesktopButton;
