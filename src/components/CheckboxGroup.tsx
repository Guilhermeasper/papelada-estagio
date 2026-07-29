import { forwardRef } from "react";
import { OptionGroup, OptionGroupOption } from "./OptionGroup";

export type CheckboxGroupOption<T extends string | number> =
  OptionGroupOption<T>;

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
  { value, onChange, ...props }: CheckboxGroupProps<T>,
  ref: React.Ref<HTMLInputElement>,
) {
  const toggle = (option: T) => {
    const next = value.includes(option)
      ? value.filter((entry) => entry !== option)
      : [...value, option];

    onChange(
      props.options
        .map((entry) => entry.value)
        .filter((entry) => next.includes(entry)),
    );
  };

  return (
    <OptionGroup
      {...props}
      type="checkbox"
      isChecked={(option) => value.includes(option)}
      onSelect={toggle}
      inputRef={ref}
    />
  );
}

export const CheckboxGroup = forwardRef(CheckboxGroupInner) as <
  T extends string | number,
>(
  props: CheckboxGroupProps<T> & { ref?: React.Ref<HTMLInputElement> },
) => ReturnType<typeof CheckboxGroupInner>;
