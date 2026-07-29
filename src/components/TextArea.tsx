import { toFieldId } from "@papelada-estagio/utils/fieldId";
import {
  forwardRef,
  TextareaHTMLAttributes,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import { FormField } from "./FormField";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { label, error, hint, id, className = "", onInput, ...props },
    ref,
  ) => {
    const textareaId = toFieldId(label, id);
    const localRef = useRef<HTMLTextAreaElement>(null);
    const lastWidthRef = useRef<number | null>(null);

    useImperativeHandle(ref, () => localRef.current as HTMLTextAreaElement);

    const adjustHeight = () => {
      const textarea = localRef.current;
      if (textarea) {
        textarea.style.height = "0px";
        const borders = textarea.offsetHeight - textarea.clientHeight;
        textarea.style.height = `${textarea.scrollHeight + borders}px`;
      }
    };

    useLayoutEffect(() => {
      adjustHeight();
    }, []);

    useLayoutEffect(() => {
      adjustHeight();
    }, [props.value]);

    useLayoutEffect(() => {
      const textarea = localRef.current;
      if (!textarea) return;

      const observer = new ResizeObserver((entries) => {
        const width = entries[0].contentRect.width;
        if (width === lastWidthRef.current) return;
        lastWidthRef.current = width;
        adjustHeight();
      });

      observer.observe(textarea);
      return () => observer.disconnect();
    }, []);

    return (
      <FormField
        id={textareaId}
        label={label}
        required={props.required}
        error={error}
        hint={hint}
      >
        <textarea
          ref={localRef}
          id={textareaId}
          style={{ overflow: "hidden", resize: "none" }}
          className={`
            w-full px-4 py-2.5 text-sm md:text-base 
            border border-border dark:border-border-dark rounded-md
            bg-surface-elevated dark:bg-surface-elevated-dark text-text-primary dark:text-text-primary-dark
            placeholder:text-text-secondary dark:placeholder:text-text-secondary-dark
            transition-colors duration-200
            hover:border-text-secondary dark:hover:border-text-secondary-dark
            focus:ring-2
            ${error ? "border-input-error focus:border-input-error focus:ring-input-focus/20" : "focus:border-input-focus focus:ring-input-focus/20"}
            disabled:bg-text-secondary/20 dark:disabled:bg-text-secondary-dark/20 disabled:cursor-not-allowed
            min-h-[100px]
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : hint
                ? `${textareaId}-hint`
                : undefined
          }
          onInput={(e) => {
            adjustHeight();
            onInput?.(e);
          }}
          {...props}
        />
      </FormField>
    );
  },
);

TextArea.displayName = "TextArea";
