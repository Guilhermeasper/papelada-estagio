import { zodResolver } from "@hookform/resolvers/zod";
import {
  DateInput,
  EmailInput,
  Input,
  MaskedInput,
} from "@papelada-estagio/components";
import { IStep6Props } from "@papelada-estagio/types";
import {
  addDays,
  parseIsoDate,
  toIsoString,
} from "@papelada-estagio/utils/dateUtils";
import { StepFooter } from "@papelada-estagio/wizard/StepFooter";
import { StepHeader } from "@papelada-estagio/wizard/StepHeader";
import { StepSection } from "@papelada-estagio/wizard/StepSection";
import {
  SupervisionFormData,
  supervisionSchema,
} from "@papelada-estagio/wizard/schemas/validationSchemas";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export function SupervisionFormStep({
  data,
  endDate,
  onNext,
  onBack,
}: IStep6Props) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SupervisionFormData>({
    resolver: zodResolver(supervisionSchema),
    defaultValues: {
      ...data,
      evaluationDeadline:
        data.evaluationDeadline ||
        (endDate ? toIsoString(addDays(parseIsoDate(endDate), 12)) : ""),
    },
  });

  const onSubmit = (formData: SupervisionFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <StepHeader
        title={t("forms.supervision.title")}
        subtitle={t("forms.supervision.subtitle")}
      />

      <StepSection
        headerClassName="mb-4"
        title={
          <>
            <svg
              className="w-5 h-5 text-brand-accent"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            {t("forms.supervision.supervisorSection")}
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="supervisorName"
            label={t("forms.supervision.supervisorNameLabel")}
            placeholder={t("forms.supervision.supervisorNamePlaceholder")}
            {...register("supervisorName")}
            error={errors.supervisorName?.message}
            required
          />

          <Input
            id="supervisorPosition"
            label={t("forms.supervision.supervisorPositionLabel")}
            placeholder={t("forms.supervision.supervisorPositionPlaceholder")}
            {...register("supervisorPosition")}
            error={errors.supervisorPosition?.message}
            required
          />

          <EmailInput
            id="supervisorEmail"
            label={t("forms.supervision.supervisorEmailLabel")}
            placeholder={t("forms.supervision.supervisorEmailPlaceholder")}
            {...register("supervisorEmail")}
            error={errors.supervisorEmail?.message}
            required
          />

          <MaskedInput
            label={t("forms.supervision.supervisorPhoneLabel")}
            mask="phone"
            placeholder="(00) 00000-0000"
            {...register("supervisorPhone")}
            error={errors.supervisorPhone?.message}
            required
          />

          <MaskedInput
            label={t("forms.supervision.supervisorCpfLabel")}
            mask="cpf"
            placeholder="000.000.000-00"
            {...register("supervisorCpf")}
            error={errors.supervisorCpf?.message}
            required
          />
        </div>
      </StepSection>

      <StepSection
        headerClassName="mb-4"
        title={
          <>
            <svg
              className="w-5 h-5 text-brand-accent"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            {t("forms.supervision.advisorSection")}
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="advisorName"
            label={t("forms.supervision.advisorNameLabel")}
            placeholder={t("forms.supervision.advisorNamePlaceholder")}
            {...register("advisorName")}
            error={errors.advisorName?.message}
            required
          />

          <Input
            id="advisorPosition"
            label={t("forms.supervision.advisorPositionLabel")}
            placeholder={t("forms.supervision.advisorPositionPlaceholder")}
            {...register("advisorPosition")}
            error={errors.advisorPosition?.message}
            required
          />

          <EmailInput
            id="advisorEmail"
            label={t("forms.supervision.advisorEmailLabel")}
            placeholder={t("forms.supervision.advisorEmailPlaceholder")}
            {...register("advisorEmail")}
            error={errors.advisorEmail?.message}
            required
          />

          <Input
            label={t("forms.supervision.advisorSiapeLabel")}
            placeholder={t("forms.supervision.advisorSiapePlaceholder")}
            {...register("advisorSiape")}
            error={errors.advisorSiape?.message}
            required
          />

          <Controller
            name="evaluationDeadline"
            control={control}
            render={({ field }) => (
              <DateInput
                id="evaluationDeadline"
                label={t("forms.supervision.evaluationDeadlineLabel")}
                {...field}
                error={errors.evaluationDeadline?.message}
                hint={t("forms.supervision.evaluationDeadlineHint")}
                required
              />
            )}
          />
        </div>
      </StepSection>

      <StepFooter onBack={onBack} isSubmitting={isSubmitting} />
    </form>
  );
}
