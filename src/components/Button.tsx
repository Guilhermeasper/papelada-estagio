import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "danger-ghost";
  size?: "sm" | "md" | "lg" | "icon";
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  isLoading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-md
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-primary text-white dark:text-cin-black dark:bg-cin-white
      hover:bg-primary-hover dark:hover:bg-cin-gray
      active:bg-primary-hover dark:active:bg-cin-gray
    `,
    secondary: `
      bg-surface-elevated dark:bg-surface-elevated-dark text-text-primary dark:text-text-primary-dark border border-border dark:border-border-dark
      hover:bg-text-secondary/10 dark:hover:bg-text-secondary-dark/10
      active:bg-text-secondary/20 dark:active:bg-text-secondary-dark/20
    `,
    outline: `
      border-2 border-primary dark:border-cin-white text-primary dark:text-cin-white
      hover:bg-primary hover:text-white dark:hover:bg-cin-white dark:hover:text-cin-black
      active:bg-primary-hover dark:active:bg-cin-gray
    `,
    ghost: `
      text-text-primary dark:text-text-primary-dark
      hover:bg-text-secondary/10 dark:hover:bg-text-secondary-dark/10
      active:bg-text-secondary/20 dark:active:bg-text-secondary-dark/20
    `,
    danger: `
      bg-destructive text-white
      hover:bg-cin-dark
      active:bg-cin-dark
      focus:ring-destructive
    `,
    "danger-ghost": `
      text-destructive dark:text-destructive
      hover:bg-destructive/10 dark:hover:bg-destructive/10
      active:bg-destructive/20 dark:active:bg-destructive/20
      focus:ring-destructive
    `,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm md:text-base",
    lg: "px-6 py-3 text-base md:text-lg",
    icon: "p-2",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
