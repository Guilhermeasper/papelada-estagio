import { toFieldId } from "@papelada-estagio/utils/fieldId";
import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { FormField } from "./FormField";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, trailing, id, className = "", ...props }, ref) => {
    const inputId = toFieldId(label, id);

    return (
      <FormField
        id={inputId}
        label={label}
        required={props.required}
        error={error}
        hint={hint}
      >
        <div className="relative">
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
            focus:ring-2
            ${error ? "border-input-error focus:border-input-error focus:ring-input-focus/20" : "focus:border-input-focus focus:ring-input-focus/20"}
            disabled:bg-text-secondary/20 dark:disabled:bg-text-secondary-dark/20 disabled:cursor-not-allowed
            ${trailing ? "pr-11" : ""}
            ${className}
          `}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {trailing && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {trailing}
            </div>
          )}
        </div>
      </FormField>
    );
  },
);

Input.displayName = "Input";
