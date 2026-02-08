import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-xs md:text-sm font-medium text-text-primary dark:text-text-primary-dark"
        >
          {label}
          {props.required && <span className="text-destructive ml-0.5">*</span>}
        </label>

        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5 text-sm md:text-base
            border border-border dark:border-border-dark rounded-md
            bg-surface-elevated dark:bg-surface-elevated-dark text-text-primary dark:text-text-primary-dark
            placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark
            transition-colors duration-200
            hover:border-text-secondary dark:hover:border-text-secondary-dark
            focus:border-input-focus focus:ring-2 focus:ring-input-focus/20
            disabled:bg-text-secondary/20 dark:disabled:bg-text-secondary-dark/20 disabled:cursor-not-allowed
            ${error ? "border-input-error" : ""}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />

        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="text-xs text-text-secondary dark:text-text-secondary-dark"
          >
            {hint}
          </p>
        )}

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs text-error-text font-medium"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
