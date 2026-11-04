import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  EmailInput,
  Input,
  MaskedInput,
} from "@papelada-estagio/components";
import { IStep2Props } from "@papelada-estagio/types";
import { StepFooter } from "@papelada-estagio/wizard/StepFooter";
import { StepHeader } from "@papelada-estagio/wizard/StepHeader";
import {
  StudentFormData,
  studentSchema,
} from "@papelada-estagio/wizard/schemas/validationSchemas";
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
      <StepHeader
        title={t("forms.student.title")}
        subtitle={t("forms.student.subtitle")}
      />

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

      <StepFooter isSubmitting={isSubmitting} />
    </form>
  );
}
