import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "icon";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "rounded-2xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const normalSizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const iconSizes = {
    sm: "p-1.5 text-sm",
    md: "p-2.5 text-base",
    lg: "p-3.5 text-lg",
  };

  const variants = {
    primary:
      "bg-primary hover:bg-rose-600 hover:shadow-rose-200 text-white shadow-medium",
    secondary: "bg-purple-600 hover:bg-purple-700 text-white",
    outline: "border-2 border-primary text-primary hover: bg-rose-50",
    icon: "text-slate-600 hover:text-rose-600 hover:scale-105",
  };

  const currentSize = variant === "icon" ? iconSizes[size] : normalSizes[size];

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${currentSize} cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
