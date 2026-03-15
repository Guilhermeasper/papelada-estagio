import { forwardRef, InputHTMLAttributes, useRef, useState } from "react";
import { Input } from "./Input";

interface EmailInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "type"
> {
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

export const EmailInput = ({
  ref,
  label,
  error,
  hint,
  id,
  className = "",
  onChange,
  domainSuggestions = DEFAULT_DOMAINS,
  ...props
}: EmailInputProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
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
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className="flex flex-col gap-1.5 relative" ref={containerRef}>
      <Input
        ref={ref}
        id={inputId}
        label={label}
        type="email"
        error={error}
        hint={hint}
        onChange={handleChange}
        onBlur={handleBlur}
        className={className}
        {...props}
      />

      {showSuggestions && filteredDomains.length > 0 && (
        <ul className="absolute top-17.5 left-0 right-0 mt-1 bg-surface-elevated dark:bg-surface-elevated-dark border border-border dark:border-border-dark rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
          {filteredDomains.map((domain) => (
            <li
              key={domain}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-surface dark:hover:bg-surface-dark text-text-primary dark:text-text-primary-dark"
              onMouseDown={() => {
                handleSelectDomain(domain);
              }}
            >
              {inputValue.slice(0, inputValue.lastIndexOf("@") + 1)}
              <span className="font-medium">{domain}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

EmailInput.displayName = "EmailInput";
