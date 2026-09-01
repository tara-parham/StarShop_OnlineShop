import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-2xl font-medium transition-all active:scale-95 disabled:opacity-50";
  const variants = {
    primary:
      "bg-rose-500 hover:bg-rose-600 hover:shadow-rose-200 text-white shadow-medium",
    secondary: "bg-purple-600 hover:bg-purple-700 text-white",
    outline: "border-2 border-rose-500 text-rose-500 hover: bg-rose-50",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
