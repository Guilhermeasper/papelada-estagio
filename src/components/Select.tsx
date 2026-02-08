import { forwardRef, SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, hint, id, className = "", ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className="text-xs md:text-sm font-medium text-text-primary dark:text-text-primary-dark"
        >
          {label}
          {props.required && <span className="text-destructive ml-0.5">*</span>}
        </label>

        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-4 py-2.5 text-sm md:text-base 
            border border-border dark:border-border-dark rounded-md
            bg-surface-elevated dark:bg-surface-elevated-dark text-text-primary dark:text-text-primary-dark
            transition-colors duration-200
            hover:border-text-secondary dark:hover:border-text-secondary-dark
            focus:ring-2
            ${error ? "border-input-error focus:border-input-error focus:ring-input-error/20" : "focus:border-input-focus focus:ring-input-focus/20"}
            disabled:bg-text-secondary/20 dark:disabled:bg-text-secondary-dark/20 disabled:cursor-not-allowed
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
          }
          {...props}
        >
          <option value="">Selecione...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {hint && !error && (
          <p
            id={`${selectId}-hint`}
            className="text-xs text-text-secondary dark:text-text-secondary-dark"
          >
            {hint}
          </p>
        )}

        {error && (
          <p
            id={`${selectId}-error`}
            className="text-xs text-error-text font-medium"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
