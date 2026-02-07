import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-md
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cin-red
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
  
  const variants = {
    primary: `
      bg-cin-red text-white
      hover:bg-cin-dark
      active:bg-cin-dark
    `,
    secondary: `
      bg-surface-elevated dark:bg-surface-elevated-dark text-text-primary dark:text-text-primary-dark border border-border dark:border-border-dark
      hover:bg-text-secondary/10 dark:hover:bg-text-secondary-dark/10
      active:bg-text-secondary/20 dark:active:bg-text-secondary-dark/20
    `,
    outline: `
      border-2 border-cin-red text-cin-red
      hover:bg-cin-red hover:text-white
      active:bg-cin-dark
    `,
    ghost: `
      text-text-primary dark:text-text-primary-dark
      hover:bg-text-secondary/10 dark:hover:bg-text-secondary-dark/10
      active:bg-text-secondary/20 dark:active:bg-text-secondary-dark/20
    `,
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm md:text-base',
    lg: 'px-6 py-3 text-base md:text-lg',
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
