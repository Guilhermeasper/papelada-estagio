import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckboxGroup,
  DateInput,
  Input,
  RadioGroup,
} from "@papelada-estagio/components";
import { MIN_HOURS_PER_DAY } from "@papelada-estagio/constants";
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
import { StepFooter } from "@papelada-estagio/wizard/StepFooter";
import { StepHeader } from "@papelada-estagio/wizard/StepHeader";
import { StepSection } from "@papelada-estagio/wizard/StepSection";
import { WorkScheduleField } from "@papelada-estagio/wizard/WorkScheduleField";
import {
  InternshipGeneralFormData,
  makeInternshipGeneralSchema,
} from "@papelada-estagio/wizard/schemas/validationSchemas";
import { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

export function InternshipGeneralStep({
  data,
  rules,
  onNext,
  onBack,
}: IStep4Props) {
  const { t } = useTranslation();
  const { requiredHours, maxHoursPerDay } = rules;

  const generalSchema = useMemo(
    () => makeInternshipGeneralSchema({ requiredHours, maxHoursPerDay }),
    [requiredHours, maxHoursPerDay],
  );

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
    setValue,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<InternshipGeneralFormData>({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      ...data,
      hoursPerDay: data.hoursPerDay || 6,
    },
  });

  const startDate = useWatch({ control, name: "startDate" });
  const hoursPerDay = useWatch({ control, name: "hoursPerDay" });
  const endDate = useWatch({ control, name: "endDate" });
  const workDays = useWatch({ control, name: "workDays" });

  const debouncedHoursPerDay = useDebounce(hoursPerDay, 300);

  const syncEndDate = useCallback(
    (start: string, hours: number, days: number[]) => {
      if (!start || !hours || !days.length) return;

      const result = calculateEndDate(start, hours, days, requiredHours);
      setValue("endDate", result.isValid ? result.endDate : "", {
        shouldValidate: result.isValid,
      });
    },
    [setValue, requiredHours],
  );

  useEffect(() => {
    syncEndDate(
      getValues("startDate"),
      debouncedHoursPerDay,
      getValues("workDays"),
    );

    if (getValues("startDate")) {
      void trigger("startDate");
    }
  }, [debouncedHoursPerDay, workDays, getValues, syncEndDate, trigger]);

  useEffect(() => {
    if (!debouncedHoursPerDay) return;

    setValue(
      "workSchedule",
      rebalanceForTotal(getValues("workSchedule"), debouncedHoursPerDay * 60),
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
      <StepHeader
        title={t("forms.general.title")}
        subtitle={t("forms.general.subtitle")}
      />

      <StepSection
        className="p-6 space-y-6"
        title={t("forms.general.periodSectionTitle")}
      >
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
                max={maxHoursPerDay}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                error={errors.hoursPerDay?.message}
                hint={t("forms.general.hoursPerDayHint", {
                  max: maxHoursPerDay,
                })}
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
                hint={t("forms.general.endDateHint", { hours: requiredHours })}
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
                  className={`font-medium ${periodInfo.totalHours >= requiredHours ? "text-success" : "text-error-text"}`}
                >
                  {periodInfo.totalHours}h
                  {periodInfo.totalHours >= requiredHours
                    ? " ✓"
                    : ` ${t("forms.general.summaryMinHours", { hours: requiredHours })}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </StepSection>

      <StepSection className="p-6 space-y-6">
        <Controller
          name="workDays"
          control={control}
          render={({ field }) => (
            <CheckboxGroup
              name="workDays"
              label={t("forms.general.workDaysLabel")}
              options={WEEKDAY_OPTIONS}
              value={field.value}
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
      </StepSection>

      <StepFooter onBack={onBack} isSubmitting={isSubmitting} />
    </form>
  );
}
