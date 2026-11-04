import { zodResolver } from "@hookform/resolvers/zod";
import { Input, MaskedInput } from "@papelada-estagio/components";
import { IStep3Props } from "@papelada-estagio/types";
import { StepFooter } from "@papelada-estagio/wizard/StepFooter";
import { StepHeader } from "@papelada-estagio/wizard/StepHeader";
import {
  CompanyFormData,
  companySchema,
} from "@papelada-estagio/wizard/schemas/validationSchemas";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export function CompanyFormStep({ data, onNext, onBack }: IStep3Props) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: data,
  });

  const onSubmit = (formData: CompanyFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <StepHeader
        title={t("forms.company.title")}
        subtitle={t("forms.company.subtitle")}
      />

      <div className="space-y-6">
        <Input
          label={t("forms.company.companyNameLabel")}
          placeholder={t("forms.company.companyNamePlaceholder")}
          {...register("companyName")}
          error={errors.companyName?.message}
          required
        />

        <Input
          label={t("forms.company.companyAddressLabel")}
          placeholder={t("forms.company.companyAddressPlaceholder")}
          {...register("companyAddress")}
          error={errors.companyAddress?.message}
          required
        />

        <MaskedInput
          label={t("forms.company.companyCnpjLabel")}
          mask="cnpj"
          placeholder={t("forms.company.companyCnpjPlaceholder")}
          {...register("companyCnpj")}
          error={errors.companyCnpj?.message}
          required
        />
      </div>

      <StepFooter onBack={onBack} isSubmitting={isSubmitting} />
    </form>
  );
}
