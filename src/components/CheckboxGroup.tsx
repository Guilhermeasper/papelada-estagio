import { forwardRef } from "react";

export interface CheckboxGroupOption<T extends string | number> {
  value: T;
  label: string;
}

interface CheckboxGroupProps<T extends string | number> {
  label: string;
  options: CheckboxGroupOption<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  onBlur?: () => void;
  name?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

function CheckboxGroupInner<T extends string | number>(
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
  }: CheckboxGroupProps<T>,
  ref: React.Ref<HTMLInputElement>,
) {
  const groupId = name || label.toLowerCase().replace(/\s+/g, "-");

  const toggle = (option: T) => {
    const next = value.includes(option)
      ? value.filter((entry) => entry !== option)
      : [...value, option];

    onChange(
      options
        .map((entry) => entry.value)
        .filter((entry) => next.includes(entry)),
    );
  };

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
          const checked = value.includes(option.value);
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
                type="checkbox"
                id={optionId}
                name={groupId}
                value={String(option.value)}
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(option.value)}
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
}

export const CheckboxGroup = forwardRef(CheckboxGroupInner) as <
  T extends string | number,
>(
  props: CheckboxGroupProps<T> & { ref?: React.Ref<HTMLInputElement> },
) => ReturnType<typeof CheckboxGroupInner>;
