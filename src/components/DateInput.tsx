import {
  formatDateIso,
  formatDatePtBr,
} from "@papelada-estagio/utils/dateUtils";
import { maskDate } from "@papelada-estagio/utils/masks";
import { forwardRef, InputHTMLAttributes, useRef, useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

interface DateInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type" | "min" | "max"
> {
  label?: string;
  error?: string;
  hint?: string;
  min?: string;
  max?: string;
  value: string;
  onChange: (isoDate: string) => void;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ error, hint, min, max, value, onChange, disabled, ...props }, ref) => {
    const pickerRef = useRef<HTMLInputElement>(null);

    const [state, setState] = useState<{ draft: string | null; value: string }>(
      { draft: null, value },
    );

    if (state.value !== value) {
      setState({ draft: null, value });
    }

    const display = state.draft ?? formatDatePtBr(value);

    const commit = (masked: string) => {
      const isoDate = formatDateIso(masked);
      setState({ draft: isoDate ? null : masked, value: isoDate });
      onChange(isoDate);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentRaw = e.target.value;

      const prevDigits = display.replace(/\D/g, "");
      const currentDigits = currentRaw.replace(/\D/g, "");

      let valueToMask = currentRaw;
      if (
        currentDigits.length === prevDigits.length &&
        currentRaw.length < display.length
      ) {
        valueToMask = prevDigits.slice(0, -1);
      }

      commit(maskDate(valueToMask));
    };

    const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      commit(formatDatePtBr(e.target.value));
    };

    const openPicker = () => {
      const picker = pickerRef.current;
      if (!picker) return;

      if (typeof picker.showPicker === "function") {
        picker.showPicker();
      } else {
        picker.focus();
      }
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder="DD/MM/AAAA"
        maxLength={10}
        autoComplete="off"
        value={display}
        onChange={handleChange}
        error={error}
        hint={hint}
        disabled={disabled}
        trailing={
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={openPicker}
              disabled={disabled}
              aria-label="Abrir calendário"
              title="Abrir calendário"
              className="rounded-lg text-text-secondary dark:text-text-secondary-dark"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </Button>

            <input
              ref={pickerRef}
              type="date"
              tabIndex={-1}
              aria-hidden="true"
              min={min}
              max={max}
              value={value}
              onChange={handlePickerChange}
              disabled={disabled}
              className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
            />
          </div>
        }
        {...props}
      />
    );
  },
);

DateInput.displayName = "DateInput";
