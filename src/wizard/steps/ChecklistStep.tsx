import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChecklistCard,
  ChecklistItem,
  Input,
  RadioGroup,
  Select,
} from "@papelada-estagio/components";
import {
  COURSES,
  CURRICULUM_PROFILES,
  INTERNSHIP_REGIMES,
  MANDATORY_INTERNSHIP_RULES,
  REGIME_RULES,
} from "@papelada-estagio/constants/internshipRules";
import { IStep1Props } from "@papelada-estagio/types";
import { ProcessCard } from "@papelada-estagio/wizard/ProcessCard";
import { StepFooter } from "@papelada-estagio/wizard/StepFooter";
import { StepHeader } from "@papelada-estagio/wizard/StepHeader";
import { StepSection } from "@papelada-estagio/wizard/StepSection";
import {
  useChecklistData,
  useSourceLabels,
} from "@papelada-estagio/wizard/data/checklist";
import {
  SECGRAD_INTERNSHIP_URL,
  useBeforeStage,
} from "@papelada-estagio/wizard/data/process";
import {
  FramingFormData,
  framingSchema,
} from "@papelada-estagio/wizard/schemas/validationSchemas";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

export function ChecklistStep({ data, onNext }: IStep1Props) {
  const { t } = useTranslation();
  const sourceLabels = useSourceLabels();
  const beforeStage = useBeforeStage();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FramingFormData>({
    resolver: zodResolver(framingSchema),
    defaultValues: data,
  });

  const course = useWatch({ control, name: "course" });
  const profile = useWatch({ control, name: "curriculumProfile" });
  const regime = useWatch({ control, name: "regime" });

  const checklistData = useChecklistData(regime);

  const courseOptions = useMemo(
    () => COURSES.map((value) => ({ value, label: value })),
    [],
  );
  const profileOptions = useMemo(
    () =>
      CURRICULUM_PROFILES.map((value) => ({
        value,
        label: t(`checklist.framing.profiles.${value}`),
      })),
    [t],
  );
  const regimeOptions = useMemo(
    () =>
      INTERNSHIP_REGIMES.map((value) => ({
        value,
        label: t(`checklist.framing.regimes.${value}`),
      })),
    [t],
  );

  const courseRules = course ? MANDATORY_INTERNSHIP_RULES[course] : null;
  const neverHasMandatory =
    courseRules !== null &&
    CURRICULUM_PROFILES.every((key) => courseRules[key].kind === "none");
  const rule = courseRules && profile ? courseRules[profile] : null;
  const isBlocked = neverHasMandatory || rule?.kind === "none";

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <StepHeader
        title={t("checklist.beforeTitle")}
        subtitle={t("checklist.beforeSubtitle")}
      />

      <StepSection className="p-6 space-y-6">
        <Select
          label={t("checklist.framing.courseLabel")}
          options={courseOptions}
          {...register("course")}
          error={errors.course?.message}
          required
        />

        {!neverHasMandatory && (
          <Controller
            name="curriculumProfile"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="curriculumProfile"
                label={t("checklist.framing.profileLabel")}
                options={profileOptions}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={errors.curriculumProfile?.message}
                hint={t("checklist.framing.profileHint")}
                required
              />
            )}
          />
        )}

        {isBlocked && course ? (
          <div className="bg-warning/10 border border-warning/40 rounded-md p-4 text-sm text-warning dark:text-warning-dark space-y-1">
            <p className="font-medium">
              {t("checklist.framing.noMandatoryTitle")}
            </p>
            <p>
              {t("checklist.framing.noMandatoryBody", { course })}{" "}
              <a
                href={SECGRAD_INTERNSHIP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 break-words"
              >
                {SECGRAD_INTERNSHIP_URL.replace("https://", "")}
              </a>
            </p>
          </div>
        ) : (
          <>
            <Controller
              name="regime"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  name="regime"
                  label={t("checklist.framing.regimeLabel")}
                  options={regimeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  error={errors.regime?.message}
                  required
                />
              )}
            />

            {rule?.kind === "declared" && (
              <div className="space-y-3">
                <p className="text-sm text-warning dark:text-warning-dark">
                  {t("checklist.framing.declaredNotice")}
                </p>
                <Controller
                  name="declaredRequiredHours"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label={t("checklist.framing.declaredLabel")}
                      type="number"
                      min={1}
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? null
                            : Number(event.target.value),
                        )
                      }
                      error={errors.declaredRequiredHours?.message}
                      required
                    />
                  )}
                />
              </div>
            )}

            {rule && rule.kind !== "none" && (
              <div className="text-sm text-text-secondary dark:text-text-secondary-dark space-y-1">
                {rule.kind === "fixed" && (
                  <p>
                    {t("checklist.framing.requiredHours", {
                      hours: rule.hours,
                    })}
                  </p>
                )}
                <p>
                  {t(`checklist.framing.prerequisites.${rule.prerequisiteId}`)}
                </p>
                {regime && (
                  <p>
                    {t("checklist.framing.maxHours", {
                      hours: REGIME_RULES[regime].maxHoursPerDay,
                    })}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </StepSection>

      <ProcessCard stage={beforeStage} />

      <div className="space-y-4">
        {checklistData.map((card) => (
          <ChecklistCard
            key={card.title}
            title={card.title}
            description={card.description}
            badge={{
              label: sourceLabels[card.source],
              variant: card.source,
            }}
          >
            {card.items.map((item) => (
              <ChecklistItem key={item.content} label={item.label}>
                {item.content}
              </ChecklistItem>
            ))}
          </ChecklistCard>
        ))}
      </div>

      <StepFooter
        nextLabel={t("checklist.readyButton")}
        isSubmitting={isSubmitting}
        right={isBlocked ? <span /> : undefined}
        className="mt-8"
      />
    </form>
  );
}
