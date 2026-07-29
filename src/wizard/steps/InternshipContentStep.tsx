import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DateInput,
  DynamicList,
  TextArea,
} from "@papelada-estagio/components";
import { MAX_SCHEDULE_ITEMS } from "@papelada-estagio/constants";
import { IScheduleItem, IStep5Props } from "@papelada-estagio/types";
import { getPeriodInfo } from "@papelada-estagio/utils/dateCalculator";
import {
  applyRanges,
  buildRanges,
  getScheduleMismatch,
  removeRangeAt,
  splitRange,
  toRange,
} from "@papelada-estagio/utils/scheduleRanges";
import { StepFooter } from "@papelada-estagio/wizard/StepFooter";
import { StepHeader } from "@papelada-estagio/wizard/StepHeader";
import { StepSection } from "@papelada-estagio/wizard/StepSection";
import {
  InternshipContentFormData,
  makeInternshipContentSchema,
} from "@papelada-estagio/wizard/schemas/validationSchemas";
import { useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const emptyScheduleItem: IScheduleItem = {
  periodStart: "",
  periodEnd: "",
  description: "",
};

function resolveInitialSchedule(
  items: IScheduleItem[],
  startDate: string,
  endDate: string,
  workDays: number[],
): IScheduleItem[] {
  if (items.some((item) => item.periodStart || item.periodEnd)) return items;

  const count = Math.max(items.length, 1);

  return applyRanges(items, buildRanges(count, startDate, endDate, workDays));
}

export function InternshipContentStep({
  data,
  general,
  onNext,
  onBack,
}: IStep5Props) {
  const { t } = useTranslation();

  const {
    startDate = "",
    endDate = "",
    workDays = [],
    hoursPerDay = 0,
  } = general ?? {};

  const hasGeneralPeriod = Boolean(startDate && endDate && workDays.length > 0);

  const [initialSchedule] = useState(() =>
    resolveInitialSchedule(data.schedule, startDate, endDate, workDays),
  );

  const contentSchema = useMemo(
    () => makeInternshipContentSchema({ startDate, endDate, workDays }),
    [startDate, endDate, workDays],
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<InternshipContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      ...data,
      activities: data.activities.length > 0 ? data.activities : [""],
      objectives: data.objectives.length > 0 ? data.objectives : [""],
      schedule: initialSchedule,
    },
  });

  const {
    fields: scheduleFields,
    append: appendSchedule,
    replace: replaceSchedule,
  } = useFieldArray({
    control,
    name: "schedule",
  });

  const activities = watch("activities");
  const objectives = watch("objectives");
  const schedule = watch("schedule");

  const lastScheduleItem = schedule?.[schedule.length - 1];

  const canSplitLast = Boolean(
    hasGeneralPeriod &&
    lastScheduleItem &&
    splitRange(toRange(lastScheduleItem), workDays),
  );

  const reachedScheduleLimit = scheduleFields.length >= MAX_SCHEDULE_ITEMS;
  const canAddPeriod =
    !reachedScheduleLimit && (!hasGeneralPeriod || canSplitLast);

  const addPeriodHint = reachedScheduleLimit
    ? t("forms.content.addPeriodLimit", { max: MAX_SCHEDULE_ITEMS })
    : t("forms.content.addPeriodNotEnoughDays");

  const scheduleMismatch = hasGeneralPeriod
    ? getScheduleMismatch(schedule ?? [], startDate, endDate)
    : null;

  const handleAddPeriod = () => {
    const items = getValues("schedule");
    if (items.length >= MAX_SCHEDULE_ITEMS) return;

    const lastIndex = items.length - 1;
    const halves = items[lastIndex]
      ? splitRange(toRange(items[lastIndex]), workDays)
      : null;

    if (!halves) {
      appendSchedule({ ...emptyScheduleItem });
      return;
    }

    setValue(`schedule.${lastIndex}.periodEnd`, halves[0].end, {
      shouldDirty: true,
    });
    appendSchedule({
      periodStart: halves[1].start,
      periodEnd: halves[1].end,
      description: "",
    });
  };

  const handleRemovePeriod = (index: number) => {
    const items = getValues("schedule");
    if (items.length <= 1) return;

    replaceSchedule(removeRangeAt(items, index));
  };

  const handleRecalculateSchedule = () => {
    const items = getValues("schedule");

    replaceSchedule(
      applyRanges(
        items,
        buildRanges(items.length, startDate, endDate, workDays),
      ),
    );
  };

  const createArrayFieldHandlers = (
    field: "activities" | "objectives",
    currentItems: string[],
  ) => ({
    onAdd: () => setValue(field, [...currentItems, ""]),
    onRemove: (index: number) =>
      setValue(
        field,
        currentItems.filter((_, i) => i !== index),
      ),
    onChange: (index: number, value: string) => {
      const next = [...currentItems];
      next[index] = value;
      setValue(field, next);
    },
  });

  const activityHandlers = createArrayFieldHandlers("activities", activities);
  const objectiveHandlers = createArrayFieldHandlers("objectives", objectives);

  const onSubmit = (formData: InternshipContentFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <StepHeader
        title={t("forms.content.title")}
        subtitle={t("forms.content.subtitle")}
        className="mb-4 md:mb-6"
      />

      <StepSection
        title={t("forms.content.activitiesSection")}
        className="p-4 md:p-6"
        headerClassName="mb-3 md:mb-4"
      >
        <DynamicList
          label={t("forms.content.activitiesLabel")}
          items={activities}
          onAdd={activityHandlers.onAdd}
          onRemove={activityHandlers.onRemove}
          onChange={activityHandlers.onChange}
          placeholder={t("forms.content.activitiesPlaceholder")}
          error={errors.activities?.message || errors.activities?.root?.message}
        />
      </StepSection>

      <StepSection
        title={t("forms.content.objectivesSection")}
        className="p-4 md:p-6"
        headerClassName="mb-3 md:mb-4"
      >
        <DynamicList
          label={t("forms.content.objectivesLabel")}
          items={objectives}
          onAdd={objectiveHandlers.onAdd}
          onRemove={objectiveHandlers.onRemove}
          onChange={objectiveHandlers.onChange}
          placeholder={t("forms.content.objectivesPlaceholder")}
          error={errors.objectives?.message || errors.objectives?.root?.message}
        />
      </StepSection>

      <StepSection
        title={t("forms.content.scheduleSection")}
        className="p-4 md:p-6"
        headerClassName="mb-3 md:mb-4"
      >
        {!hasGeneralPeriod && (
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-4">
            {t("forms.content.scheduleFillNotice")}
          </p>
        )}

        {scheduleMismatch && (
          <div className="bg-warning/10 border border-warning/40 rounded-md p-4 flex items-start gap-2 text-sm text-warning dark:text-warning-dark mb-4">
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
            <div className="space-y-2">
              <span>{scheduleMismatch}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRecalculateSchedule}
              >
                {t("forms.content.scheduleRecalculate")}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {scheduleFields.map((field, index) => {
            const item = schedule?.[index];
            const itemInfo = item
              ? getPeriodInfo(
                  item.periodStart,
                  item.periodEnd,
                  hoursPerDay,
                  workDays,
                )
              : null;

            return (
              <div
                key={field.id}
                className="bg-surface dark:bg-surface-dark rounded-md p-4 border border-border dark:border-border-dark"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
                    {t("forms.content.periodLabel", { index: index + 1 })}
                  </span>
                  {scheduleFields.length > 1 && (
                    <Button
                      type="button"
                      variant="danger-ghost"
                      size="sm"
                      onClick={() => handleRemovePeriod(index)}
                      className="p-0 h-auto"
                    >
                      {t("app.remove")}
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Controller
                      name={`schedule.${index}.periodStart`}
                      control={control}
                      render={({ field }) => (
                        <DateInput
                          id={`schedule-${index}-start`}
                          label={t("forms.content.periodStart")}
                          min={startDate || undefined}
                          max={endDate || undefined}
                          {...field}
                          className="bg-surface-elevated dark:bg-surface-elevated-dark"
                          error={errors.schedule?.[index]?.periodStart?.message}
                        />
                      )}
                    />

                    <Controller
                      name={`schedule.${index}.periodEnd`}
                      control={control}
                      render={({ field }) => (
                        <DateInput
                          id={`schedule-${index}-end`}
                          label={t("forms.content.periodEnd")}
                          min={item?.periodStart || startDate || undefined}
                          max={endDate || undefined}
                          {...field}
                          className="bg-surface-elevated dark:bg-surface-elevated-dark"
                          error={errors.schedule?.[index]?.periodEnd?.message}
                        />
                      )}
                    />
                  </div>

                  {itemInfo && (
                    <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                      {t("forms.content.periodSummary", {
                        workdays: itemInfo.workdays,
                        hours: itemInfo.totalHours,
                      })}
                    </p>
                  )}

                  <TextArea
                    {...register(`schedule.${index}.description`)}
                    placeholder={t("forms.content.scheduleDescPlaceholder")}
                  />
                  {errors.schedule?.[index]?.description && (
                    <p className="text-xs text-error-text">
                      {errors.schedule[index]?.description?.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddPeriod}
            disabled={!canAddPeriod}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            {t("forms.content.addPeriod")}
          </Button>

          {!canAddPeriod && (
            <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
              {addPeriodHint}
            </span>
          )}
        </div>
      </StepSection>

      <section className="space-y-4 md:space-y-6">
        <h3 className="text-base md:text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          {t("forms.content.reportContentSection")}
        </h3>

        <TextArea
          label={t("forms.content.introLabel")}
          {...register("introduction")}
          error={errors.introduction?.message}
          placeholder={t("forms.content.introPlaceholder")}
          rows={5}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <TextArea
            label={t("forms.content.generalObjLabel")}
            {...register("generalObjectives")}
            error={errors.generalObjectives?.message}
            placeholder={t("forms.content.generalObjPlaceholder")}
            rows={4}
            required
          />

          <TextArea
            label={t("forms.content.specificObjLabel")}
            {...register("specificObjectives")}
            error={errors.specificObjectives?.message}
            placeholder={t("forms.content.specificObjPlaceholder")}
            rows={4}
            required
          />
        </div>

        <TextArea
          label={t("forms.content.methodologyLabel")}
          {...register("methodology")}
          error={errors.methodology?.message}
          placeholder={t("forms.content.methodologyPlaceholder")}
          rows={4}
          required
        />

        <TextArea
          label={t("forms.content.developmentLabel")}
          {...register("development")}
          error={errors.development?.message}
          placeholder={t("forms.content.developmentPlaceholder")}
          rows={6}
          required
        />

        <TextArea
          label={t("forms.content.conclusionLabel")}
          {...register("conclusion")}
          error={errors.conclusion?.message}
          placeholder={t("forms.content.conclusionPlaceholder")}
          rows={4}
          required
        />
      </section>

      <StepFooter onBack={onBack} isSubmitting={isSubmitting} />
    </form>
  );
}
