import { ReactNode } from "react";

interface ChecklistCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

interface ChecklistItemProps {
  label?: string;
  children: ReactNode;
}

export function ChecklistCard({
  title,
  description,
  children,
}: ChecklistCardProps) {
  return (
    <div className="bg-surface-elevated dark:bg-surface-elevated-dark p-5 rounded-lg border border-border dark:border-border-dark shadow-sm">
      <h3 className="font-bold text-base md:text-lg text-text-primary dark:text-text-primary-dark mb-3">
        {title}
      </h3>
      <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mb-3">
        {description}
      </p>
      <ul className="list-disc pl-5 space-y-1 text-text-primary/80 dark:text-text-primary-dark/80 text-sm md:text-base">
        {children}
      </ul>
    </div>
  );
}

export function ChecklistItem({ label, children }: ChecklistItemProps) {
  return (
    <li>
      {label && <strong>{label}:</strong>} {children}
    </li>
  );
}
