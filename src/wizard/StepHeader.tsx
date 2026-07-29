interface StepHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function StepHeader({
  title,
  subtitle,
  className = "mb-6",
}: StepHeaderProps) {
  return (
    <div className={className}>
      <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
        {title}
      </h2>
      <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-1">
        {subtitle}
      </p>
    </div>
  );
}
