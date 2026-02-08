import { forwardRef, InputHTMLAttributes, useRef, useState } from "react";

interface EmailInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
  label: string;
  error?: string;
  hint?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  domainSuggestions?: string[];
}

const DEFAULT_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "cin.ufpe.br",
  "ufpe.br",
  "yahoo.com",
];

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  (
    {
      label,
      error,
      hint,
      id,
      className = "",
      onChange,
      domainSuggestions = DEFAULT_DOMAINS,
      ...props
    },
    ref,
  ) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredDomains, setFilteredDomains] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState(
      (props.defaultValue as string) || "",
    );
    const containerRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase();
      e.target.value = value;
      setInputValue(value);

      const atIndex = value.lastIndexOf("@");
      if (atIndex !== -1) {
        const typedDomain = value.slice(atIndex + 1);
        const matches = domainSuggestions.filter((domain) =>
          domain.toLowerCase().startsWith(typedDomain.toLowerCase()),
        );
        setFilteredDomains(matches);
        setShowSuggestions(matches.length > 0 && typedDomain.length > 0);
      } else {
        setShowSuggestions(false);
      }

      onChange?.(e);
    };

    const handleSelectDomain = (domain: string) => {
      const atIndex = inputValue.lastIndexOf("@");
      const newValue = inputValue.slice(0, atIndex + 1) + domain;

      const inputElement = containerRef.current?.querySelector("input");
      if (inputElement) {
        inputElement.value = newValue;
        const event = new Event("input", { bubbles: true });
        inputElement.dispatchEvent(event);

        const syntheticEvent = {
          target: inputElement,
          currentTarget: inputElement,
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }

      setInputValue(newValue);
      setShowSuggestions(false);
    };

    const handleBlur = () => {
      setTimeout(() => setShowSuggestions(false), 150);
    };

    return (
      <div className="flex flex-col gap-1.5 relative" ref={containerRef}>
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
          type="email"
          onChange={handleChange}
          onBlur={handleBlur}
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

        {showSuggestions && filteredDomains.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated dark:bg-surface-elevated-dark border border-border dark:border-border-dark rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
            {filteredDomains.map((domain) => (
              <li
                key={domain}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-surface dark:hover:bg-surface-dark text-text-primary dark:text-text-primary-dark"
                onMouseDown={() => handleSelectDomain(domain)}
              >
                {inputValue.slice(0, inputValue.lastIndexOf("@") + 1)}
                <span className="font-medium">{domain}</span>
              </li>
            ))}
          </ul>
        )}

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

EmailInput.displayName = "EmailInput";
