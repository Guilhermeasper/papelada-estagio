import { applyMask, MaskType } from "@papelada-estagio/utils/masks";
import { forwardRef, InputHTMLAttributes, useRef } from "react";
import { Input } from "./Input";

interface MaskedInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label: string;
  error?: string;
  hint?: string;
  mask: MaskType;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MaskedInput = ({
  ref,
  label,
  error,
  hint,
  mask,
  id,
  className = "",
  onChange,
  ...props
}: MaskedInputProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const prevValueRef = useRef<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentRaw = e.target.value;
    const prevValue = prevValueRef.current;

    const prevDigits = prevValue.replace(/\D/g, "");
    const currentDigits = currentRaw.replace(/\D/g, "");

    let valueToMask = currentRaw;
    if (
      currentDigits.length === prevDigits.length &&
      currentRaw.length < prevValue.length
    ) {
      valueToMask = prevDigits.slice(0, -1);
    }

    const maskedValue = applyMask(valueToMask, mask);
    e.target.value = maskedValue;
    prevValueRef.current = maskedValue;
    onChange?.(e);
  };

  return (
    <Input
      ref={ref}
      id={inputId}
      label={label}
      error={error}
      hint={hint}
      onChange={handleChange}
      className={className}
      {...props}
    />
  );
};

MaskedInput.displayName = "MaskedInput";
