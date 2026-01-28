import { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, id, className = '', rows = 4, ...props }, ref) => {
    const textareaId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="flex flex-col gap-1.5">
        <label 
          htmlFor={textareaId}
          className="text-sm font-medium text-cin-black"
        >
          {label}
          {props.required && <span className="text-cin-red ml-0.5">*</span>}
        </label>
        
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`
            w-full px-4 py-2.5 
            border border-cin-gray rounded-md
            bg-white text-cin-black
            placeholder:text-cin-black/40
            transition-colors duration-200
            hover:border-cin-black/30
            focus:border-cin-red focus:ring-2 focus:ring-cin-red/20
            disabled:bg-cin-gray/50 disabled:cursor-not-allowed
            resize-y min-h-[100px]
            ${error ? 'border-cin-red' : ''}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="text-xs text-cin-black/60">
            {hint}
          </p>
        )}
        
        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-cin-red font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
