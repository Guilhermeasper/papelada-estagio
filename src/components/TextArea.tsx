import {
  forwardRef,
  TextareaHTMLAttributes,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

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
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
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
      <div className="flex flex-col gap-1.5 w-full min-w-0">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs md:text-sm font-medium text-text-primary dark:text-text-primary-dark"
          >
            {label}
            {props.required && <span className="text-destructive ml-0.5">*</span>}
          </label>
        )}

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

        {hint && !error && (
          <p
            id={`${textareaId}-hint`}
            className="text-xs text-text-secondary dark:text-text-secondary-dark"
          >
            {hint}
          </p>
        )}

        {error && (
          <p
            id={`${textareaId}-error`}
            className="text-xs text-error-text font-medium"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
