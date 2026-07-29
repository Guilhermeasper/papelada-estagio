import { forwardRef } from "react";
import { OptionGroup, OptionGroupOption } from "./OptionGroup";

export type RadioGroupOption = OptionGroupOption<string>;

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
  ({ value, onChange, ...props }, ref) => (
    <OptionGroup
      {...props}
      type="radio"
      isChecked={(option) => option === value}
      onSelect={onChange}
      inputRef={ref}
    />
  ),
);

RadioGroup.displayName = "RadioGroup";
