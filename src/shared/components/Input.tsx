import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="flex flex-col gap-1.5">
        <label 
          htmlFor={inputId}
          className="text-sm font-medium text-text-primary"
        >
          {label}
          {props.required && <span className="text-cin-red ml-0.5">*</span>}
        </label>
        
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5 
            border border-border rounded-md
            bg-surface-elevated text-text-primary
            placeholder:text-text-secondary
            transition-colors duration-200
            hover:border-text-secondary
            focus:border-cin-red focus:ring-2 focus:ring-cin-red/20
            disabled:bg-text-secondary/20 disabled:cursor-not-allowed
            ${error ? 'border-cin-red' : ''}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-text-secondary">
            {hint}
          </p>
        )}
        
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-cin-red font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
