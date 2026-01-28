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
          className="text-sm font-medium text-cin-black"
        >
          {label}
          {props.required && <span className="text-cin-red ml-0.5">*</span>}
        </label>
        
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5 
            border border-cin-gray rounded-md
            bg-white text-cin-black
            placeholder:text-cin-black/40
            transition-colors duration-200
            hover:border-cin-black/30
            focus:border-cin-red focus:ring-2 focus:ring-cin-red/20
            disabled:bg-cin-gray/50 disabled:cursor-not-allowed
            ${error ? 'border-cin-red' : ''}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-cin-black/60">
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
