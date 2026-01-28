import { forwardRef, SelectHTMLAttributes } from 'react';

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
  ({ label, options, error, hint, id, className = '', ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="flex flex-col gap-1.5">
        <label 
          htmlFor={selectId}
          className="text-sm font-medium text-cin-black"
        >
          {label}
          {props.required && <span className="text-cin-red ml-0.5">*</span>}
        </label>
        
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-4 py-2.5 
            border border-cin-gray rounded-md
            bg-white text-cin-black
            transition-colors duration-200
            hover:border-cin-black/30
            focus:border-cin-red focus:ring-2 focus:ring-cin-red/20
            disabled:bg-cin-gray/50 disabled:cursor-not-allowed
            ${error ? 'border-cin-red' : ''}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
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
          <p id={`${selectId}-hint`} className="text-xs text-cin-black/60">
            {hint}
          </p>
        )}
        
        {error && (
          <p id={`${selectId}-error`} className="text-xs text-cin-red font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
