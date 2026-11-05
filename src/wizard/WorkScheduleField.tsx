import { RangeSlider, RangeValue } from "@papelada-estagio/components";
import {
  DAY_END_MINUTES,
  DAY_START_MINUTES,
  SCHEDULE_STEP_MINUTES,
} from "@papelada-estagio/constants";
import { IWorkSchedule } from "@papelada-estagio/types";
import {
  canBeContinuous,
  formatDuration,
  formatMinutes,
  resolveContinuousSchedule,
  resolveWorkSchedule,
  setContinuous,
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

  const { morning, afternoon } = value;
  const morningMinutes = morning.end - morning.start;
  const continuousAllowed = canBeContinuous(totalMinutes);

  return (
    <div className="flex flex-col gap-4 w-full min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs md:text-sm font-medium text-text-primary dark:text-text-primary-dark">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </span>
        {afternoon && (
          <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
            {t("components.workSchedule.interval", {
              duration: formatDuration(afternoon.start - morning.end),
            })}
          </span>
        )}
      </div>

      <label
        className={`flex items-center gap-2 text-xs md:text-sm text-text-primary dark:text-text-primary-dark ${continuousAllowed ? "cursor-pointer" : "opacity-60"}`}
      >
        <input
          type="checkbox"
          className="w-4 h-4 accent-primary"
          checked={afternoon === null}
          disabled={!continuousAllowed}
          onChange={(event) =>
            onChange(setContinuous(value, event.target.checked, totalMinutes))
          }
          onBlur={onBlur}
        />
        {t("components.workSchedule.continuous")}
      </label>

      {afternoon ? (
        <>
          <RangeSlider
            name="work-schedule-morning"
            label={t("components.workSchedule.morning")}
            min={DAY_START_MINUTES}
            max={DAY_END_MINUTES}
            step={SCHEDULE_STEP_MINUTES}
            value={morning}
            onChange={(next: RangeValue) =>
              onChange(
                resolveWorkSchedule(
                  { morning, afternoon },
                  { morning: next, afternoon },
                  totalMinutes,
                ),
              )
            }
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
            value={afternoon}
            onChange={(next: RangeValue) =>
              onChange(
                resolveWorkSchedule(
                  { morning, afternoon },
                  { morning, afternoon: next },
                  totalMinutes,
                ),
              )
            }
            onBlur={onBlur}
            formatValue={formatMinutes}
            summary={formatDuration(afternoon.end - afternoon.start)}
          />
        </>
      ) : (
        <RangeSlider
          name="work-schedule-continuous"
          label={t("components.workSchedule.continuousPeriod")}
          min={DAY_START_MINUTES}
          max={DAY_END_MINUTES}
          step={SCHEDULE_STEP_MINUTES}
          value={morning}
          onChange={(next: RangeValue) =>
            onChange(resolveContinuousSchedule(morning, next, totalMinutes))
          }
          onBlur={onBlur}
          formatValue={formatMinutes}
          summary={formatDuration(morningMinutes)}
        />
      )}

      {error ? (
        <p className="text-xs text-error-text font-medium">{error}</p>
      ) : (
        <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
          {continuousAllowed
            ? t("components.workSchedule.summaryText", {
                duration: formatDuration(totalMinutes),
              })
            : t("components.workSchedule.summaryBreakRequired", {
                duration: formatDuration(totalMinutes),
              })}
        </p>
      )}
    </div>
  );
}
