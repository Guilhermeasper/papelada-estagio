import { ReactNode } from "react";

export interface ChecklistCardBadge {
  label: string;
  variant: "gerado" | "externo";
}

interface ChecklistCardProps {
  title: string;
  description: string;
  badge?: ChecklistCardBadge;
  children: ReactNode;
}

interface ChecklistItemProps {
  label?: string;
  highlight?: boolean;
  children: ReactNode;
}

const badgeStyles: Record<ChecklistCardBadge["variant"], string> = {
  gerado: "bg-success/10 text-success dark:text-success-dark",
  externo: "bg-warning/10 text-warning dark:text-warning-dark",
};

export function ChecklistCard({
  title,
  description,
  badge,
  children,
}: ChecklistCardProps) {
  return (
    <div className="bg-surface-elevated dark:bg-surface-elevated-dark p-5 rounded-lg border border-border dark:border-border-dark shadow-sm">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <h3 className="font-bold text-base md:text-lg text-text-primary dark:text-text-primary-dark">
          {title}
        </h3>
        {badge && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${badgeStyles[badge.variant]}`}
          >
            {badge.label}
          </span>
        )}
      </div>
      <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mb-3">
        {description}
      </p>
      <ul className="list-disc pl-5 space-y-1 text-text-primary/80 dark:text-text-primary-dark/80 text-sm md:text-base">
        {children}
      </ul>
    </div>
  );
}

export function ChecklistItem({
  label,
  highlight,
  children,
}: ChecklistItemProps) {
  return (
    <li
      className={
        highlight
          ? "text-warning marker:text-warning dark:text-warning-dark dark:marker:text-warning-dark"
          : undefined
      }
    >
      {label && <strong>{label}:</strong>} {children}
    </li>
  );
}
