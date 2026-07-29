import { toFieldId } from "@papelada-estagio/utils/fieldId";
import { ReactNode } from "react";

export interface FormFieldProps {
  id?: string;
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  as?: "div" | "fieldset";
  children: ReactNode;
}

const labelClassName =
  "text-xs md:text-sm font-medium text-text-primary dark:text-text-primary-dark";

export function FormField({
  id,
  label,
  required,
  error,
  hint,
  className = "",
  as = "div",
  children,
}: FormFieldProps) {
  const fieldId = toFieldId(label, id);
  const describedBy = !fieldId
    ? undefined
    : error
      ? `${fieldId}-error`
      : hint
        ? `${fieldId}-hint`
        : undefined;

  const labelContent = label && (
    <>
      {label}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </>
  );

  const body = (
    <>
      {children}

      {hint && !error && (
        <p
          id={fieldId ? `${fieldId}-hint` : undefined}
          className="text-xs text-text-secondary dark:text-text-secondary-dark"
        >
          {hint}
        </p>
      )}

      {error && (
        <p
          id={fieldId ? `${fieldId}-error` : undefined}
          className="text-xs text-error-text font-medium"
        >
          {error}
        </p>
      )}
    </>
  );

  if (as === "fieldset") {
    return (
      <fieldset
        className={`flex flex-col gap-1.5 w-full min-w-0 ${className}`}
        aria-invalid={!!error}
        aria-describedby={describedBy}
      >
        {labelContent && (
          <legend className={`${labelClassName} mb-1.5`}>{labelContent}</legend>
        )}
        {body}
      </fieldset>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 w-full min-w-0 ${className}`}>
      {labelContent && (
        <label htmlFor={fieldId} className={labelClassName}>
          {labelContent}
        </label>
      )}
      {body}
    </div>
  );
}
