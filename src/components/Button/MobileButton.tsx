// components/Button/MobileButton.tsx
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
  className?: string;
}

const MobileButton: React.FC<ButtonProps> = ({
  href,
  onClick,
  disabled = false,
  children,
  variant = "secondary",
  icon,
  iconPosition = "left",
  className = "",
}) => {
  // Tentukan style berdasarkan variant
  const getButtonStyle = () => {
    const baseStyles =
      "flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300";

    if (disabled) {
      return `${baseStyles} bg-gray-800 text-gray-500 opacity-60 cursor-not-allowed py-2.5 px-3 ${className}`;
    }

    if (variant === "primary") {
      return `${baseStyles} group bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-blue-500/20 hover:scale-105 active:scale-95 py-2.5 px-3 ${className}`;
    }

    return `${baseStyles} group bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-md hover:shadow-gray-700/30 hover:-translate-y-1 active:translate-y-0 py-2.5 px-3 ${className}`;
  };

  // Tentukan gaya untuk ikon
  const getIconClass = () => {
    if (disabled) {
      return iconPosition === "left" ? "mr-1.5" : "ml-1.5";
    }

    if (iconPosition === "left") {
      return variant === "primary"
        ? "mr-1.5 group-hover:animate-pulse"
        : "mr-1.5 transform group-hover:-translate-x-0.5 transition-transform";
    } else {
      return variant === "primary"
        ? "ml-1.5 group-hover:animate-pulse"
        : "ml-1.5 transform group-hover:translate-x-0.5 transition-transform";
    }
  };

  // Konten dengan icon yang rapi
  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className={getIconClass()}>{icon}</span>
      )}
      <span className="truncate">{children}</span>
      {icon && iconPosition === "right" && (
        <span className={getIconClass()}>{icon}</span>
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

export default MobileButton;
