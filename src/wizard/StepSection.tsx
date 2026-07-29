import { ReactNode } from "react";

interface StepSectionProps {
  title?: ReactNode;
  action?: ReactNode;
  className?: string;
  headerClassName?: string;
  children: ReactNode;
}

export function StepSection({
  title,
  action,
  className = "p-6",
  headerClassName = "",
  children,
}: StepSectionProps) {
  return (
    <section
      className={`bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg border border-border dark:border-border-dark ${className}`}
    >
      {(title || action) && (
        <div
          className={`flex items-center justify-between gap-2 ${headerClassName}`}
        >
          <h3 className="text-base md:text-lg font-semibold text-text-primary dark:text-text-primary-dark flex items-center gap-2">
            {title}
          </h3>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
