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

export function RadioGroup({
  ref,
  value,
  onChange,
  ...props
}: RadioGroupProps & { ref?: React.Ref<HTMLInputElement> }) {
  return (
    <OptionGroup
      {...props}
      type="radio"
      isChecked={(option) => option === value}
      onSelect={onChange}
      inputRef={ref}
    />
  );
}
