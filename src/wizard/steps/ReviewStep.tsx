import { Button } from "@papelada-estagio/components";
import { IScheduleItem, IStep7Props } from "@papelada-estagio/types";
import {
  formatDatePtBr,
  formatPeriod,
} from "@papelada-estagio/utils/dateUtils";
import { formatWorkDays } from "@papelada-estagio/utils/workDays";
import { formatWorkSchedule } from "@papelada-estagio/utils/workSchedule";
import { StepFooter } from "@papelada-estagio/wizard/StepFooter";
import { StepHeader } from "@papelada-estagio/wizard/StepHeader";
import { StepSection } from "@papelada-estagio/wizard/StepSection";
import { useTranslation } from "react-i18next";

export function ReviewStep({ data, onNext, onBack, onEdit }: IStep7Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <StepHeader title={t("review.title")} subtitle={t("review.subtitle")} />

      <ReviewSection
        title={t("review.studentSection")}
        step={2}
        onEdit={onEdit}
      >
        <ReviewItem label={t("review.name")} value={data.student.fullName} />
        <ReviewItem label={t("review.email")} value={data.student.email} />
        <ReviewItem label={t("review.phone")} value={data.student.phone} />
        <ReviewItem label={t("review.address")} value={data.student.address} />
        <ReviewItem label={t("review.course")} value={data.student.course} />
        <ReviewItem
          label={t("review.enrollmentYear")}
          value={data.student.enrollmentYear}
        />
        <ReviewItem
          label={t("review.studentId")}
          value={data.student.studentId}
        />
      </ReviewSection>

      <ReviewSection
        title={t("review.companySection")}
        step={3}
        onEdit={onEdit}
      >
        <ReviewItem
          label={t("review.company")}
          value={data.company.companyName}
        />
        <ReviewItem
          label={t("review.address")}
          value={data.company.companyAddress}
        />
        <ReviewItem label={t("review.cnpj")} value={data.company.companyCnpj} />
      </ReviewSection>

      <ReviewSection
        title={t("review.generalSection")}
        step={4}
        onEdit={onEdit}
      >
        <ReviewItem
          label={t("review.period")}
          value={t("review.periodValue", {
            start: formatDatePtBr(data.general.startDate),
            end: formatDatePtBr(data.general.endDate),
          })}
        />
        <ReviewItem
          label={t("review.hours")}
          value={t("review.hoursValue", { hours: data.general.hoursPerDay })}
        />
        <ReviewItem
          label={t("review.days")}
          value={formatWorkDays(data.general.workDays)}
        />
        <ReviewItem
          label={t("review.schedule")}
          value={formatWorkSchedule(data.general.workSchedule)}
        />
        <ReviewItem
          label={t("review.modality")}
          value={data.general.modality}
        />
      </ReviewSection>

      <ReviewSection
        title={t("review.contentSection")}
        step={5}
        onEdit={onEdit}
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-2">
              {t("review.activities")}
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {data.content.activities
                .filter(Boolean)
                .map((activity: string, index: number) => (
                  <li
                    key={`activity-${index}-${activity}`}
                    className="text-sm text-text-primary dark:text-text-primary-dark"
                  >
                    {activity}
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-2">
              {t("review.objectives")}
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {data.content.objectives
                .filter(Boolean)
                .map((objective: string, index: number) => (
                  <li
                    key={`objective-${index}-${objective}`}
                    className="text-sm text-text-primary dark:text-text-primary-dark"
                  >
                    {objective}
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-2">
              {t("review.scheduleSectionTitle")}
            </h4>
            <div className="space-y-2">
              {data.content.schedule
                .filter(
                  (item: IScheduleItem) =>
                    item.periodStart || item.periodEnd || item.description,
                )
                .map((item: IScheduleItem, index: number) => (
                  <div
                    key={`schedule-${index}`}
                    className="bg-surface-elevated dark:bg-surface-elevated-dark rounded p-3 border border-border dark:border-border-dark"
                  >
                    <p className="text-xs font-medium text-brand-accent">
                      {formatPeriod(item.periodStart, item.periodEnd)}
                    </p>
                    <p className="text-sm text-text-primary dark:text-text-primary-dark mt-1">
                      {item.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </ReviewSection>

      <ReviewSection
        title={t("review.supervisionSection")}
        step={6}
        onEdit={onEdit}
      >
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 min-w-0">
            <h4 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
              {t("review.supervisor")}
            </h4>
            <ReviewItem
              label={t("review.name")}
              value={data.supervision.supervisorName}
            />
            <ReviewItem
              label={t("review.position")}
              value={data.supervision.supervisorPosition}
            />
            <ReviewItem
              label={t("review.email")}
              value={data.supervision.supervisorEmail}
            />
            <ReviewItem
              label={t("review.phone")}
              value={data.supervision.supervisorPhone}
            />
            <ReviewItem
              label={t("review.cpf")}
              value={data.supervision.supervisorCpf}
            />
          </div>
          <div className="space-y-3 min-w-0">
            <h4 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
              {t("review.advisor")}
            </h4>
            <ReviewItem
              label={t("review.name")}
              value={data.supervision.advisorName}
            />
            <ReviewItem
              label={t("review.position")}
              value={data.supervision.advisorPosition}
            />
            <ReviewItem
              label={t("review.email")}
              value={data.supervision.advisorEmail}
            />
            <ReviewItem
              label={t("review.siape")}
              value={data.supervision.advisorSiape}
            />
            <ReviewItem
              label={t("review.evaluationDeadline")}
              value={formatDatePtBr(data.supervision.evaluationDeadline)}
            />
          </div>
        </div>
      </ReviewSection>

      <StepFooter
        onBack={onBack}
        onNext={onNext}
        nextLabel={t("review.nextButton")}
        nextType="button"
      />
    </div>
  );
}

interface ReviewSectionProps {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}

function ReviewSection({ title, step, onEdit, children }: ReviewSectionProps) {
  const { t } = useTranslation();
  return (
    <StepSection
      title={title}
      headerClassName="mb-4"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(step)}
          className="text-primary dark:text-cin-white hover:text-primary-hover dark:hover:text-cin-gray hover:bg-text-secondary/10 dark:hover:bg-text-secondary-dark/10 p-0 h-auto font-medium"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          {t("review.edit")}
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {children}
      </div>
    </StepSection>
  );
}

interface ReviewItemProps {
  label: string;
  value: string;
}

function ReviewItem({ label, value }: ReviewItemProps) {
  const { t } = useTranslation();
  return (
    <div>
      <dt className="text-[10px] md:text-xs text-text-secondary dark:text-text-secondary-dark">
        {label}
      </dt>
      <dd className="text-sm md:text-base text-text-primary dark:text-text-primary-dark font-medium break-all">
        {value || t("review.unspecified")}
      </dd>
    </div>
  );
}
