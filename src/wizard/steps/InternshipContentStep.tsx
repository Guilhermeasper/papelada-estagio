import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DynamicList,
  Input,
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
import {
  InternshipContentFormData,
  makeInternshipContentSchema,
} from "@papelada-estagio/wizard/schemas/validationSchemas";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

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
    ? `Máximo de ${MAX_SCHEDULE_ITEMS} períodos.`
    : "O último período não tem dias úteis suficientes para ser dividido.";

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

  const handleAddActivity = () => {
    setValue("activities", [...activities, ""]);
  };

  const handleRemoveActivity = (index: number) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setValue("activities", newActivities);
  };

  const handleChangeActivity = (index: number, value: string) => {
    const newActivities = [...activities];
    newActivities[index] = value;
    setValue("activities", newActivities);
  };

  const handleAddObjective = () => {
    setValue("objectives", [...objectives, ""]);
  };

  const handleRemoveObjective = (index: number) => {
    const newObjectives = objectives.filter((_, i) => i !== index);
    setValue("objectives", newObjectives);
  };

  const handleChangeObjective = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setValue("objectives", newObjectives);
  };

  const onSubmit = (formData: InternshipContentFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
          Conteúdo do Estágio
        </h2>
        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-1">
          Descreva as atividades, objetivos e detalhes do seu estágio.
        </p>
      </div>

      <section className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg p-4 md:p-6 border border-border dark:border-border-dark">
        <h3 className="text-base md:text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-3 md:mb-4">
          Atividades a serem desenvolvidas
        </h3>
        <DynamicList
          label="Atividades"
          items={activities}
          onAdd={handleAddActivity}
          onRemove={handleRemoveActivity}
          onChange={handleChangeActivity}
          placeholder="Descreva uma atividade..."
          error={errors.activities?.message || errors.activities?.root?.message}
        />
      </section>

      <section className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg p-4 md:p-6 border border-border dark:border-border-dark">
        <h3 className="text-base md:text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-3 md:mb-4">
          Objetivos / Metas a serem atingidas
        </h3>
        <DynamicList
          label="Objetivos"
          items={objectives}
          onAdd={handleAddObjective}
          onRemove={handleRemoveObjective}
          onChange={handleChangeObjective}
          placeholder="Descreva um objetivo..."
          error={errors.objectives?.message || errors.objectives?.root?.message}
        />
      </section>

      <section className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg p-4 md:p-6 border border-border dark:border-border-dark">
        <h3 className="text-base md:text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-3 md:mb-4">
          Cronograma
        </h3>

        {!hasGeneralPeriod && (
          <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-4">
            Preencha o passo 4 para calcular os períodos automaticamente.
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
                Recalcular cronograma
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
                    Período {index + 1}
                  </span>
                  {scheduleFields.length > 1 && (
                    <Button
                      type="button"
                      variant="danger-ghost"
                      size="sm"
                      onClick={() => handleRemovePeriod(index)}
                      className="p-0 h-auto"
                    >
                      Remover
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      id={`schedule-${index}-start`}
                      label="Início"
                      type="date"
                      min={startDate || undefined}
                      max={endDate || undefined}
                      {...register(`schedule.${index}.periodStart`)}
                      className="bg-surface-elevated dark:bg-surface-elevated-dark"
                      error={errors.schedule?.[index]?.periodStart?.message}
                    />

                    <Input
                      id={`schedule-${index}-end`}
                      label="Término"
                      type="date"
                      min={item?.periodStart || startDate || undefined}
                      max={endDate || undefined}
                      {...register(`schedule.${index}.periodEnd`)}
                      className="bg-surface-elevated dark:bg-surface-elevated-dark"
                      error={errors.schedule?.[index]?.periodEnd?.message}
                    />
                  </div>

                  {itemInfo && (
                    <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                      {itemInfo.workdays} dias úteis · {itemInfo.totalHours}h
                    </p>
                  )}

                  <TextArea
                    {...register(`schedule.${index}.description`)}
                    placeholder="Descrição das atividades do período..."
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
            Adicionar período
          </Button>

          {!canAddPeriod && (
            <span className="text-xs text-text-secondary dark:text-text-secondary-dark">
              {addPeriodHint}
            </span>
          )}
        </div>
      </section>

      <section className="space-y-4 md:space-y-6">
        <h3 className="text-base md:text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Conteúdo do Relatório
        </h3>

        <TextArea
          label="Introdução"
          {...register("introduction")}
          error={errors.introduction?.message}
          placeholder="Apresentação do estágio, empresa e objetivos..."
          rows={5}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <TextArea
            label="Objetivos Gerais"
            {...register("generalObjectives")}
            error={errors.generalObjectives?.message}
            placeholder="O objetivo geral do estágio foi..."
            rows={4}
            required
          />

          <TextArea
            label="Objetivos Específicos"
            {...register("specificObjectives")}
            error={errors.specificObjectives?.message}
            placeholder="Os objetivos específicos incluíram..."
            rows={4}
            required
          />
        </div>

        <TextArea
          label="Material e Método"
          {...register("methodology")}
          error={errors.methodology?.message}
          placeholder="Tecnologias, metodologias e ferramentas utilizadas..."
          rows={4}
          required
        />

        <TextArea
          label="Desenvolvimento"
          {...register("development")}
          error={errors.development?.message}
          placeholder="Descrição detalhada das atividades realizadas..."
          rows={6}
          required
        />

        <TextArea
          label="Conclusão"
          {...register("conclusion")}
          error={errors.conclusion?.message}
          placeholder="Considerações finais sobre o estágio..."
          rows={4}
          required
        />
      </section>

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
          Voltar
        </Button>

        <Button type="submit" isLoading={isSubmitting}>
          Próximo
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
