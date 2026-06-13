import React, { type ReactNode } from "react";

interface ButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

type ButtonVariant = "success" | "info" | "danger" | "alert" | "outline";

const variants: Record<ButtonVariant, string> = {
  info: "bg-green-600 hover:bg-green-700 text-white",
  success: "bg-green-500 hover:bg-green-600 text-white",

  danger: "bg-rose-500 hover:bg-rose-600 text-white",
  alert: "bg-amber-500 hover:bg-amber-600 text-white",

  // opposite of success
  outline:
    "bg-white border border-green-600 text-green-700 hover:bg-green-50",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "info",
  children,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-2 rounded-md font-semibold transition-all duration-200
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </button>
  );
};