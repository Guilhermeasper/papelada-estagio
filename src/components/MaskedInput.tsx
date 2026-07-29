import {
  applyMask,
  getBackspacedMaskValue,
  MaskType,
} from "@papelada-estagio/utils/masks";
import { forwardRef, InputHTMLAttributes, useRef } from "react";
import { Input } from "./Input";

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
      const valueToMask = getBackspacedMaskValue(
        e.target.value,
        prevValueRef.current,
      );
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
  },
);

MaskedInput.displayName = "MaskedInput";
