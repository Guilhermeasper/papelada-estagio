export interface RangeValue {
  start: number;
  end: number;
}

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: RangeValue;
  onChange: (value: RangeValue) => void;
  onBlur?: () => void;
  formatValue?: (value: number) => string;
  summary?: string;
  name?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const THUMB_CLASSES = `
  [&::-webkit-slider-thumb]:pointer-events-auto
  [&::-webkit-slider-thumb]:appearance-none
  [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
  [&::-webkit-slider-thumb]:rounded-full
  [&::-webkit-slider-thumb]:bg-primary
  [&::-webkit-slider-thumb]:border-2
  [&::-webkit-slider-thumb]:border-surface-elevated
  dark:[&::-webkit-slider-thumb]:border-surface-elevated-dark
  [&::-webkit-slider-thumb]:shadow
  [&::-webkit-slider-thumb]:cursor-grab
  [&::-moz-range-thumb]:pointer-events-auto
  [&::-moz-range-thumb]:appearance-none
  [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
  [&::-moz-range-thumb]:rounded-full
  [&::-moz-range-thumb]:bg-primary
  [&::-moz-range-thumb]:border-2
  [&::-moz-range-thumb]:border-surface-elevated
  dark:[&::-moz-range-thumb]:border-surface-elevated-dark
  [&::-moz-range-thumb]:cursor-grab
`;

export function RangeSlider({
  ref,
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  onBlur,
  formatValue,
  summary,
  name,
  error,
  hint,
  required,
  disabled,
  className = "",
}: RangeSliderProps & { ref?: React.Ref<HTMLInputElement> }) {
  const groupId = name || label.toLowerCase().replace(/\s+/g, "-");
  const format = formatValue ?? ((entry: number) => String(entry));

  const span = max - min || 1;
  const toPercent = (entry: number) => ((entry - min) / span) * 100;

  const startPercent = toPercent(value.start);
  const endPercent = toPercent(value.end);
  const startOnTop = startPercent > 50;

  const inputClasses = `
      absolute inset-x-0 top-0 w-full h-6 m-0
      appearance-none bg-transparent pointer-events-none
      focus:outline-none focus-visible:outline-none
      disabled:cursor-not-allowed
      ${THUMB_CLASSES}
    `;

  return (
    <div className={`flex flex-col gap-1.5 w-full min-w-0 ${className}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs md:text-sm font-medium text-text-primary dark:text-text-primary-dark">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </span>
        <span className="text-xs md:text-sm text-text-secondary dark:text-text-secondary-dark tabular-nums">
          {format(value.start)} – {format(value.end)}
          {summary && (
            <span className="ml-2 font-medium text-text-primary dark:text-text-primary-dark">
              {summary}
            </span>
          )}
        </span>
      </div>

      <div className={`relative h-6 ${disabled ? "opacity-60" : ""}`}>
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-border dark:bg-border-dark" />
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full ${error ? "bg-input-error" : "bg-primary"}`}
          style={{
            left: `${startPercent}%`,
            width: `${Math.max(endPercent - startPercent, 0)}%`,
          }}
        />

        <input
          ref={ref}
          type="range"
          aria-label={`${label} — início`}
          min={min}
          max={max}
          step={step}
          value={value.start}
          disabled={disabled}
          onChange={(event) =>
            onChange({ start: Number(event.target.value), end: value.end })
          }
          onBlur={onBlur}
          className={inputClasses}
          style={{ zIndex: startOnTop ? 4 : 3 }}
        />

        <input
          type="range"
          aria-label={`${label} — fim`}
          min={min}
          max={max}
          step={step}
          value={value.end}
          disabled={disabled}
          onChange={(event) =>
            onChange({ start: value.start, end: Number(event.target.value) })
          }
          onBlur={onBlur}
          className={inputClasses}
          style={{ zIndex: startOnTop ? 3 : 4 }}
        />
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
    </div>
  );
}
