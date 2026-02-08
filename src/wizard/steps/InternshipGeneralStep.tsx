import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Select } from "../../components";
import { useDebounce } from "../../hooks";
import { dateService } from "../../services";
import { formatDatePtBr } from "../../utils/dateUtils";
import {
  InternshipGeneralFormData,
  internshipGeneralSchema,
} from "../schemas/validationSchemas";
import type { IStep4Props } from "../step-types";

const modalityOptions = [
  { value: "Remoto", label: "Remoto" },
  { value: "Presencial", label: "Presencial" },
  { value: "Híbrido", label: "Híbrido" },
];

export function InternshipGeneralStep({ data, onNext, onBack }: IStep4Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
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

  const debouncedStartDate = useDebounce(startDate, 300);
  const debouncedHoursPerDay = useDebounce(hoursPerDay, 300);

  useEffect(() => {
    if (debouncedStartDate && debouncedHoursPerDay) {
      const result = dateService.calculateEndDate(
        debouncedStartDate,
        debouncedHoursPerDay,
      );
      if (result.isValid) {
        setValue("endDate", result.endDate);
      }
    }
  }, [debouncedStartDate, debouncedHoursPerDay, setValue]);

  const periodInfo = useMemo(() => {
    return dateService.getPeriodInfo(startDate, endDate, hoursPerDay);
  }, [startDate, endDate, hoursPerDay]);

  const onSubmit = (formData: InternshipGeneralFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
          Informações Gerais
        </h2>
        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-1">
          Configuração do período e carga horária do estágio.
        </p>
      </div>

      <div className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg p-6 space-y-6 border border-border dark:border-border-dark">
        <h3 className="text-base md:text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Período e Carga Horária
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Data de Início"
            type="date"
            {...register("startDate")}
            error={errors.startDate?.message}
            hint="Não pode ser fim de semana ou feriado"
            required
          />

          <Controller
            name="hoursPerDay"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs md:text-sm font-medium text-text-primary dark:text-text-primary-dark">
                  Horas por Dia <span className="text-cin-red">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className={`
                    w-full px-4 py-2.5 
                    border border-border dark:border-border-dark rounded-md
                    bg-surface-elevated dark:bg-surface-elevated-dark text-text-primary dark:text-text-primary-dark
                    focus:border-cin-red focus:ring-2 focus:ring-cin-red/20
                    ${errors.hoursPerDay ? "border-cin-red" : ""}
                  `}
                />
                {errors.hoursPerDay && (
                  <p className="text-xs text-cin-red">
                    {errors.hoursPerDay.message}
                  </p>
                )}
              </div>
            )}
          />

          <Input
            label="Data de Término"
            type="date"
            {...register("endDate")}
            error={errors.endDate?.message}
            hint="Calculada automaticamente (mín. 300h)"
            required
          />
        </div>

        {periodInfo && (
          <div className="bg-surface dark:bg-surface-dark rounded-md p-4 border border-border dark:border-border-dark">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-cin-red"
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
                Resumo do Período
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-text-secondary dark:text-text-secondary-dark">
                  Início:
                </span>
                <p className="font-medium">{formatDatePtBr(startDate)}</p>
              </div>
              <div>
                <span className="text-text-secondary dark:text-text-secondary-dark">
                  Término:
                </span>
                <p className="font-medium">{formatDatePtBr(endDate)}</p>
              </div>
              <div>
                <span className="text-text-secondary dark:text-text-secondary-dark">
                  Dias úteis:
                </span>
                <p className="font-medium">{periodInfo.workdays} dias</p>
              </div>
              <div>
                <span className="text-text-secondary dark:text-text-secondary-dark">
                  Total de horas:
                </span>
                <p
                  className={`font-medium ${periodInfo.totalHours >= 300 ? "text-green-600" : "text-cin-red"}`}
                >
                  {periodInfo.totalHours}h
                  {periodInfo.totalHours >= 300 ? " ✓" : " (mín. 300h)"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Dias de Trabalho"
          placeholder="Ex: Segunda-feira a Sexta-feira"
          {...register("workDays")}
          error={errors.workDays?.message}
          required
        />

        <Input
          label="Horário de Trabalho"
          placeholder="Ex: Das 9:00h às 12:00h e 13:00h às 18:00h"
          {...register("workSchedule")}
          error={errors.workSchedule?.message}
          required
        />

        <Controller
          name="modality"
          control={control}
          render={({ field }) => (
            <Select
              label="Modalidade"
              options={modalityOptions}
              {...field}
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
