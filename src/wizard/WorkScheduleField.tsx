import { RangeSlider, RangeValue } from "@papelada-estagio/components";
import {
  DAY_END_MINUTES,
  DAY_START_MINUTES,
  SCHEDULE_STEP_MINUTES,
} from "@papelada-estagio/constants";
import { IWorkSchedule } from "@papelada-estagio/types";
import {
  formatDuration,
  formatMinutes,
  resolveWorkSchedule,
} from "@papelada-estagio/utils/workSchedule";
import { useTranslation } from "react-i18next";

interface WorkScheduleFieldProps {
  label: string;
  value: IWorkSchedule;
  onChange: (value: IWorkSchedule) => void;
  onBlur?: () => void;
  hoursPerDay: number;
  error?: string;
  required?: boolean;
}

export function WorkScheduleField({
  label,
  value,
  onChange,
  onBlur,
  hoursPerDay,
  error,
  required,
}: WorkScheduleFieldProps) {
  const { t } = useTranslation();
  const totalMinutes = hoursPerDay * 60;

  const morningMinutes = value.morning.end - value.morning.start;
  const afternoonMinutes = value.afternoon.end - value.afternoon.start;
  const breakMinutes = value.afternoon.start - value.morning.end;

  const handleMorning = (next: RangeValue) => {
    onChange(
      resolveWorkSchedule(
        value,
        { morning: next, afternoon: value.afternoon },
        totalMinutes,
      ),
    );
  };

  const handleAfternoon = (next: RangeValue) => {
    onChange(
      resolveWorkSchedule(
        value,
        { morning: value.morning, afternoon: next },
        totalMinutes,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs md:text-sm font-medium text-text-primary dark:text-text-primary-dark">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </span>
        <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
          {t("components.workSchedule.interval", {
            duration: formatDuration(breakMinutes),
          })}
        </span>
      </div>

      <RangeSlider
        name="work-schedule-morning"
        label={t("components.workSchedule.morning")}
        min={DAY_START_MINUTES}
        max={DAY_END_MINUTES}
        step={SCHEDULE_STEP_MINUTES}
        value={value.morning}
        onChange={handleMorning}
        onBlur={onBlur}
        formatValue={formatMinutes}
        summary={formatDuration(morningMinutes)}
      />

      <RangeSlider
        name="work-schedule-afternoon"
        label={t("components.workSchedule.afternoon")}
        min={DAY_START_MINUTES}
        max={DAY_END_MINUTES}
        step={SCHEDULE_STEP_MINUTES}
        value={value.afternoon}
        onChange={handleAfternoon}
        onBlur={onBlur}
        formatValue={formatMinutes}
        summary={formatDuration(afternoonMinutes)}
      />

      {error ? (
        <p className="text-xs text-error-text font-medium">{error}</p>
      ) : (
        <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
          {t("components.workSchedule.summaryText", {
            duration: formatDuration(totalMinutes),
          })}
        </p>
      )}
    </div>
  );
}
