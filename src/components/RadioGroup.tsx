import { forwardRef } from "react";

export interface RadioGroupOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioGroupOption[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      onBlur,
      name,
      error,
      hint,
      required,
      disabled,
      className = "",
    },
    ref,
  ) => {
    const groupId = name || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <fieldset
        className={`flex flex-col gap-1.5 w-full min-w-0 ${className}`}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${groupId}-error` : hint ? `${groupId}-hint` : undefined
        }
      >
        <legend className="text-xs md:text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1.5">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </legend>

        <div className="flex flex-wrap gap-2">
          {options.map((option, index) => {
            const checked = value === option.value;
            const optionId = `${groupId}-${option.value}`;

            return (
              <label
                key={option.value}
                htmlFor={optionId}
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
                `}
              >
                <input
                  ref={index === 0 ? ref : undefined}
                  type="radio"
                  id={optionId}
                  name={groupId}
                  value={option.value}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => onChange(option.value)}
                  onBlur={onBlur}
                  className="w-4 h-4 accent-primary cursor-pointer disabled:cursor-not-allowed"
                />
                {option.label}
              </label>
            );
          })}
        </div>

        {hint && !error && (
          <p
            id={`${groupId}-hint`}
            className="text-xs text-text-secondary dark:text-text-secondary-dark"
          >
            {hint}
          </p>
        )}

        {error && (
          <p
            id={`${groupId}-error`}
            className="text-xs text-error-text font-medium"
          >
            {error}
          </p>
        )}
      </fieldset>
    );
  },
);

RadioGroup.displayName = "RadioGroup";
