import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, Button, EmailInput, Input, MaskedInput } from "@papelada-estagio/components";
import { IStep2Props } from "@papelada-estagio/types";
import { StudentFormData, studentSchema } from "@papelada-estagio/wizard/schemas/validationSchemas";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export function StudentFormStep({ data, onNext }: IStep2Props) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: StudentFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">
          {t("forms.student.title")}
        </h2>
        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-1">
          {t("forms.student.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label={t("forms.student.fullNameLabel")}
            placeholder={t("forms.student.fullNamePlaceholder")}
            {...register("fullName")}
            error={errors.fullName?.message}
            required
          />
        </div>

        <EmailInput
          label={t("forms.student.emailLabel")}
          placeholder={t("forms.student.emailPlaceholder")}
          {...register("email")}
          error={errors.email?.message}
          required
        />

        <MaskedInput
          label={t("forms.student.phoneLabel")}
          mask="phone"
          placeholder={t("forms.student.phonePlaceholder")}
          {...register("phone")}
          error={errors.phone?.message}
          required
        />

        <div className="md:col-span-2">
          <Input
            label={t("forms.student.addressLabel")}
            placeholder={t("forms.student.addressPlaceholder")}
            {...register("address")}
            error={errors.address?.message}
            required
          />
        </div>

        <Autocomplete
          label={t("forms.student.courseLabel")}
          placeholder={t("forms.student.coursePlaceholder")}
          options={[
            "Ciência da Computação",
            "Engenharia da Computação",
            "Sistemas de Informação",
            "Inteligência Artificial",
          ]}
          {...register("course")}
          error={errors.course?.message}
          required
        />

        <MaskedInput
          label={t("forms.student.enrollmentYearLabel")}
          mask="enrollmentYear"
          placeholder={t("forms.student.enrollmentYearPlaceholder")}
          {...register("enrollmentYear")}
          error={errors.enrollmentYear?.message}
          hint={t("forms.student.enrollmentYearHint")}
          required
        />

        <Input
          label={t("forms.student.studentIdLabel")}
          placeholder={t("forms.student.studentIdPlaceholder")}
          {...register("studentId")}
          error={errors.studentId?.message}
          required
        />
      </div>

      <div className="flex justify-end pt-6 border-t border-border dark:border-border-dark">
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
