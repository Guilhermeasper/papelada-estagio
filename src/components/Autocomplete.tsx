import { forwardRef, useState, useEffect, useRef, ChangeEvent, FocusEvent } from "react";
import { Input } from "./Input";

interface AutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  options: string[];
  error?: string;
  hint?: string;
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  ({ label, options, error, hint, id, className = "", onChange, onBlur, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(props.value?.toString() || props.defaultValue?.toString() || "");
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const internalInputRef = useRef<HTMLInputElement | null>(null);

    // Sync inputValue if controlled from outside (though RHF is usually uncontrolled)
    useEffect(() => {
        if (props.value !== undefined) {
             setInputValue(props.value.toString());
        }
    }, [props.value]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      
      if (value) {
        const filtered = options.filter((option) =>
          option.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOptions(filtered);
        setIsOpen(true);
      } else {
        setFilteredOptions([]);
        setIsOpen(false);
      }

      if (onChange) {
        onChange(e);
      }
    };

    const handleSelectOption = (option: string) => {
      setInputValue(option);
      setIsOpen(false);
      
      // Update the actual input value and trigger change event for RHF
      if (internalInputRef.current) {
        internalInputRef.current.value = option;
        
        // Create a synthetic event
        const event = {
          target: internalInputRef.current,
          currentTarget: internalInputRef.current,
          type: "change",
        } as ChangeEvent<HTMLInputElement>;
        
        if (onChange) {
          onChange(event);
        }
      }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
       // Delay closing to allow click on option
       setTimeout(() => {
           setIsOpen(false);
       }, 200);

       if (onBlur) {
           onBlur(e);
       }
    };

    // Merge refs
    const setRefs = (element: HTMLInputElement | null) => {
        internalInputRef.current = element;
        if (typeof ref === "function") {
            ref(element);
        } else if (ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
        }
    };

    return (
      <div className="flex flex-col gap-1.5 relative w-full min-w-0" ref={containerRef}>
        <div className="relative">
            <Input
            ref={setRefs}
            id={inputId}
            label={label}
            error={error}
            hint={hint}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={() => {
                if(inputValue) {
                     const filtered = options.filter((option) =>
                        option.toLowerCase().includes(inputValue.toLowerCase())
                      );
                      setFilteredOptions(filtered);
                      setIsOpen(true);
                }
            }}
            autoComplete="off"
            className={className}
            {...props}
            />
            
            {isOpen && filteredOptions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-surface-elevated dark:bg-surface-elevated-dark border border-border dark:border-border-dark rounded-md shadow-lg">
                    {filteredOptions.map((option, index) => (
                        <li
                            key={`opt-${index}-${option}`}
                            className="px-4 py-2 text-sm text-text-primary dark:text-text-primary-dark hover:bg-text-secondary/10 dark:hover:bg-text-secondary-dark/10 cursor-pointer transition-colors duration-150"
                            onClick={() => handleSelectOption(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>
    );
  },
);

Autocomplete.displayName = "Autocomplete";
