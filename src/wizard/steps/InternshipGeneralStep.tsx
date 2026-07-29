import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CheckboxGroup,
  DateInput,
  Input,
  RadioGroup,
} from "@papelada-estagio/components";
import {
  MAX_HOURS_PER_DAY,
  MIN_HOURS_PER_DAY,
} from "@papelada-estagio/constants";
import { useDebounce } from "@papelada-estagio/hooks";
import { IStep4Props } from "@papelada-estagio/types";
import {
  calculateEndDate,
  getLeadTimeWarning,
  getPeriodInfo,
} from "@papelada-estagio/utils/dateCalculator";
import { formatDatePtBr } from "@papelada-estagio/utils/dateUtils";
import { WEEKDAY_OPTIONS } from "@papelada-estagio/utils/workDays";
import { rebalanceForTotal } from "@papelada-estagio/utils/workSchedule";
import { WorkScheduleField } from "@papelada-estagio/wizard/WorkScheduleField";
import {
  InternshipGeneralFormData,
  internshipGeneralSchema,
} from "@papelada-estagio/wizard/schemas/validationSchemas";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export function InternshipGeneralStep({ data, onNext, onBack }: IStep4Props) {
  const { t } = useTranslation();

  const modalityOptions = useMemo(
    () => [
      { value: "Remoto", label: t("forms.general.modalities.remote") },
      { value: "Presencial", label: t("forms.general.modalities.presential") },
      { value: "Híbrido", label: t("forms.general.modalities.hybrid") },
    ],
    [t],
  );

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<InternshipGeneralFormData>({
    resolver: zodResolver(internshipGeneralSchema),
    defaultValues: {
      ...data,
      hoursPerDay: data.hoursPerDay || 6,
    },
  });

  const startDate = watch("startDate");
  const hoursPerDay = watch("hoursPerDay");
  const endDate = watch("endDate");
  const workDays = watch("workDays");

  const debouncedHoursPerDay = useDebounce(hoursPerDay, 300);

  const syncEndDate = useCallback(
    (start: string, hours: number, days: number[]) => {
      if (!start || !hours || !days?.length) return;

      const result = calculateEndDate(start, hours, days);
      setValue("endDate", result.isValid ? result.endDate : "", {
        shouldValidate: result.isValid,
      });
    },
    [setValue],
  );

  useEffect(() => {
    syncEndDate(
      getValues("startDate"),
      debouncedHoursPerDay,
      getValues("workDays"),
    );

    if (getValues("startDate")) {
      trigger("startDate");
    }
  }, [debouncedHoursPerDay, workDays, getValues, syncEndDate, trigger]);

  useEffect(() => {
    if (!debouncedHoursPerDay) return;

    const current = getValues("workSchedule");
    if (!current) return;

    setValue(
      "workSchedule",
      rebalanceForTotal(current, debouncedHoursPerDay * 60),
      {
        shouldValidate: true,
      },
    );
  }, [debouncedHoursPerDay, getValues, setValue]);

  const periodInfo = useMemo(() => {
    return getPeriodInfo(startDate, endDate, hoursPerDay, workDays);
  }, [startDate, endDate, hoursPerDay, workDays]);

  const leadTimeWarning = useMemo(() => {
    return getLeadTimeWarning(startDate);
  }, [startDate]);

  const onSubmit = (formData: InternshipGeneralFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
          {t("forms.general.title")}
        </h2>
        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-1">
          {t("forms.general.subtitle")}
        </p>
      </div>

      <div className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg p-6 space-y-6 border border-border dark:border-border-dark">
        <h3 className="text-base md:text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          {t("forms.general.periodSectionTitle")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <DateInput
                label={t("forms.general.startDateLabel")}
                {...field}
                onChange={(isoDate) => {
                  field.onChange(isoDate);
                  syncEndDate(
                    isoDate,
                    getValues("hoursPerDay"),
                    getValues("workDays"),
                  );
                }}
                error={errors.startDate?.message}
                hint={t("forms.general.startDateHint")}
                required
              />
            )}
          />

          <Controller
            name="hoursPerDay"
            control={control}
            render={({ field }) => (
              <Input
                label={t("forms.general.hoursPerDayLabel")}
                type="number"
                min={MIN_HOURS_PER_DAY}
                max={MAX_HOURS_PER_DAY}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                error={errors.hoursPerDay?.message}
                required
              />
            )}
          />

          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <DateInput
                label={t("forms.general.endDateLabel")}
                {...field}
                error={errors.endDate?.message}
                hint={t("forms.general.endDateHint")}
                required
              />
            )}
          />
        </div>

        {leadTimeWarning && (
          <div className="bg-warning/10 border border-warning/40 rounded-md p-4 flex items-start gap-2 text-sm text-warning dark:text-warning-dark">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              {leadTimeWarning} {t("forms.general.leadTimeWarningSuffix")}
            </span>
          </div>
        )}

        {periodInfo && (
          <div className="bg-surface dark:bg-surface-dark rounded-md p-4 border border-border dark:border-border-dark">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-brand-accent"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium text-text-primary dark:text-text-primary-dark">
                {t("forms.general.summaryTitle")}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-text-secondary dark:text-text-secondary-dark">
                  {t("forms.general.summaryStart")}
                </span>
                <p className="font-medium">{formatDatePtBr(startDate)}</p>
              </div>
              <div>
                <span className="text-text-secondary dark:text-text-secondary-dark">
                  {t("forms.general.summaryEnd")}
                </span>
                <p className="font-medium">{formatDatePtBr(endDate)}</p>
              </div>
              <div>
                <span className="text-text-secondary dark:text-text-secondary-dark">
                  {t("forms.general.summaryWorkdays")}
                </span>
                <p className="font-medium">
                  {t("forms.general.summaryWorkdaysCount", {
                    count: periodInfo.workdays,
                  })}
                </p>
              </div>
              <div>
                <span className="text-text-secondary dark:text-text-secondary-dark">
                  {t("forms.general.summaryTotalHours")}
                </span>
                <p
                  className={`font-medium ${periodInfo.totalHours >= 300 ? "text-success" : "text-error-text"}`}
                >
                  {periodInfo.totalHours}h
                  {periodInfo.totalHours >= 300
                    ? " ✓"
                    : ` ${t("forms.general.summaryMinHours")}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg p-6 space-y-6 border border-border dark:border-border-dark">
        <Controller
          name="workDays"
          control={control}
          render={({ field }) => (
            <CheckboxGroup
              name="workDays"
              label={t("forms.general.workDaysLabel")}
              options={WEEKDAY_OPTIONS}
              value={field.value ?? []}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={errors.workDays?.message}
              hint={t("forms.general.workDaysHint")}
              required
            />
          )}
        />

        <Controller
          name="workSchedule"
          control={control}
          render={({ field }) => (
            <WorkScheduleField
              label={t("forms.general.workScheduleLabel")}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              hoursPerDay={hoursPerDay}
              error={errors.workSchedule?.message}
              required
            />
          )}
        />

        <Controller
          name="modality"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name="modality"
              label={t("forms.general.modalityLabel")}
              options={modalityOptions}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={errors.modality?.message}
              required
            />
          )}
        />
      </div>

      <div className="flex justify-between pt-6 border-t border-border dark:border-border-dark">
        <Button type="button" variant="ghost" onClick={onBack}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t("app.back")}
        </Button>

        <Button type="submit" isLoading={isSubmitting}>
          {t("app.next")}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>
    </form>
  );
}
