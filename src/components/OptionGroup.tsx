import { toFieldId } from "@papelada-estagio/utils/fieldId";
import { FormField } from "./FormField";
import { OptionCard } from "./OptionCard";

export interface OptionGroupOption<T extends string | number> {
  value: T;
  label: string;
}

interface OptionGroupProps<T extends string | number> {
  type: "radio" | "checkbox";
  label: string;
  options: OptionGroupOption<T>[];
  isChecked: (value: T) => boolean;
  onSelect: (value: T) => void;
  onBlur?: () => void;
  name?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function OptionGroup<T extends string | number>({
  type,
  label,
  options,
  isChecked,
  onSelect,
  onBlur,
  name,
  error,
  hint,
  required,
  disabled,
  className = "",
  inputRef,
}: OptionGroupProps<T>) {
  const groupId = toFieldId(label, name);

  return (
    <FormField
      as="fieldset"
      id={groupId}
      label={label}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const checked = isChecked(option.value);
          const optionId = `${groupId}-${option.value}`;

          return (
            <OptionCard
              key={option.value}
              id={optionId}
              checked={checked}
              disabled={disabled}
              error={!!error}
            >
              <input
                ref={index === 0 ? inputRef : undefined}
                type={type}
                id={optionId}
                name={groupId}
                value={String(option.value)}
                checked={checked}
                disabled={disabled}
                onChange={() => onSelect(option.value)}
                onBlur={onBlur}
                className="w-4 h-4 accent-primary cursor-pointer disabled:cursor-not-allowed"
              />
              {option.label}
            </OptionCard>
          );
        })}
      </div>
    </FormField>
  );
}
