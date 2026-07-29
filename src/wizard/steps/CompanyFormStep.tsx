import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, MaskedInput } from "@papelada-estagio/components";
import { IStep3Props } from "@papelada-estagio/types";
import { CompanyFormData, companySchema } from "@papelada-estagio/wizard/schemas/validationSchemas";
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
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
          {t("forms.company.title")}
        </h2>
        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-1">
          {t("forms.company.subtitle")}
        </p>
      </div>

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
