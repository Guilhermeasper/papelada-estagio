import { ReactNode } from "react";

interface OptionCardProps {
  id: string;
  checked: boolean;
  disabled?: boolean;
  error?: boolean;
  children: ReactNode;
  className?: string;
}

export function OptionCard({
  id,
  checked,
  disabled,
  error,
  children,
  className = "",
}: OptionCardProps) {
  return (
    <label
      htmlFor={id}
      className={`
        flex items-center gap-2 px-3 py-2 text-sm md:text-base rounded-md
        border transition-colors duration-200 cursor-pointer select-none
        ${
          checked
            ? "border-primary bg-primary/10 text-text-primary dark:text-text-primary-dark"
            : "border-border dark:border-border-dark bg-surface-elevated dark:bg-surface-elevated-dark text-text-secondary dark:text-text-secondary-dark"
        }
        ${error ? "border-input-error" : ""}
        ${disabled ? "cursor-not-allowed opacity-60" : "hover:border-text-secondary dark:hover:border-text-secondary-dark"}
        ${className}
      `}
    >
      {children}
    </label>
  );
}
