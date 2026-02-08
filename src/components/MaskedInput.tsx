import { applyMask, MaskType } from "@papelada-estagio/utils/masks";
import { forwardRef, InputHTMLAttributes, useRef } from "react";

interface MaskedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  error?: string;
  hint?: string;
  mask: MaskType;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ label, error, hint, mask, id, className = "", onChange, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const prevValueRef = useRef<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentRaw = e.target.value;
      const prevValue = prevValueRef.current;

      const prevDigits = prevValue.replace(/\D/g, "");
      const currentDigits = currentRaw.replace(/\D/g, "");

      let valueToMask = currentRaw;
      if (currentDigits.length === prevDigits.length && currentRaw.length < prevValue.length) {
        valueToMask = prevDigits.slice(0, -1);
      }

      const maskedValue = applyMask(valueToMask, mask);
      e.target.value = maskedValue;
      prevValueRef.current = maskedValue;
      onChange?.(e);
    };

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-xs md:text-sm font-medium text-text-primary dark:text-text-primary-dark"
        >
          {label}
          {props.required && <span className="text-cin-red ml-0.5">*</span>}
        </label>

        <input
          ref={ref}
          id={inputId}
          onChange={handleChange}
          className={`
            w-full px-4 py-2.5 text-sm md:text-base
            border border-border dark:border-border-dark rounded-md
            bg-surface-elevated dark:bg-surface-elevated-dark text-text-primary dark:text-text-primary-dark
            placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark
            transition-colors duration-200
            hover:border-text-secondary dark:hover:border-text-secondary-dark
            focus:border-cin-red focus:ring-2 focus:ring-cin-red/20
            disabled:bg-text-secondary/20 dark:disabled:bg-text-secondary-dark/20 disabled:cursor-not-allowed
            ${error ? "border-cin-red" : ""}
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
            className="text-xs text-cin-red font-medium"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

MaskedInput.displayName = "MaskedInput";
