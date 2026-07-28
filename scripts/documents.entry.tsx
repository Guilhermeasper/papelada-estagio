import { ActivityPlanDocument } from "@papelada-estagio/documents/activity-plan/ActivityPlanDocument";
import { AdvisorEvaluationDocument } from "@papelada-estagio/documents/advisor-eval/AdvisorEvaluationDocument";
import { ReportDocument } from "@papelada-estagio/documents/report/ReportDocument";
import { SupervisorEvaluationDocument } from "@papelada-estagio/documents/supervisor-eval/SupervisorEvaluationDocument";
import { mockAdvisorEvaluationData } from "@papelada-estagio/mocks/mockAdvisorEvaluationData";
import { mockInternshipData } from "@papelada-estagio/mocks/mockInternshipData";
import { mockSupervisorEvaluationData } from "@papelada-estagio/mocks/mockSupervisorEvaluationData";
import { pageStyles } from "@papelada-estagio/components/pdf/styles";
import type { PageVariant } from "@papelada-estagio/components/pdf/PDFPage";
import { PDF_CONTENT } from "@papelada-estagio/constants/pdf-content";
import type { IInternshipData } from "@papelada-estagio/types";
import { renderToFile } from "@react-pdf/renderer";
import { writeFile } from "node:fs/promises";
import type { ReactElement } from "react";

type Variant = {
  name: string;
  page: PageVariant;
  headings: string[];
  /** Pages that are deliberately short, e.g. a cover — exempt from the whitespace check. */
  coverPages?: number[];
  element: ReactElement;
};

/** Headings a page must never end on — mirrors what PDFSection renders. */
const activityPlanHeadings = [
  ...Object.values(PDF_CONTENT.activityPlan.sections).map(
    (title, index) => `${index + 1}. ${title}`,
  ),
  ...Object.values(PDF_CONTENT.activityPlan.subsections),
];

const reportHeadings = Object.values(PDF_CONTENT.report.sections);

const evaluationHeadings = [
  `1. ${PDF_CONTENT.evaluationDocument.shared.sections.identification}`,
  `2. ${PDF_CONTENT.evaluationDocument.shared.sections.evaluation}`,
  `3. ${PDF_CONTENT.evaluationDocument.shared.comments.title}`,
  "4. NOTA",
];

function withActivities(count: number, wordsPerItem: number): IInternshipData {
  const items = Array.from({ length: count }, (_, index) =>
    `Atividade ${index + 1}: ${"palavra ".repeat(wordsPerItem).trim()}.`,
  );

  return {
    ...mockInternshipData,
    content: {
      ...mockInternshipData.content,
      activities: items,
      objectives: items,
    },
  };
}

export const variants: Variant[] = [
  {
    name: "activity-plan",
    page: "activityPlan",
    headings: activityPlanHeadings,
    element: <ActivityPlanDocument data={mockInternshipData} />,
  },
  {
    name: "report",
    page: "report",
    headings: reportHeadings,
    coverPages: [1],
    element: <ReportDocument data={mockInternshipData} />,
  },
  {
    name: "supervisor-eval",
    page: "evaluation",
    headings: evaluationHeadings,
    element: (
      <SupervisorEvaluationDocument
        data={mockInternshipData}
        evaluation={mockSupervisorEvaluationData}
      />
    ),
  },
  {
    name: "advisor-eval",
    page: "evaluation",
    headings: evaluationHeadings,
    element: (
      <AdvisorEvaluationDocument
        data={mockInternshipData}
        evaluation={mockAdvisorEvaluationData}
      />
    ),
  },
  {
    name: "stress-activity-plan-short",
    page: "activityPlan",
    headings: activityPlanHeadings,
    element: <ActivityPlanDocument data={withActivities(1, 6)} />,
  },
  {
    name: "stress-activity-plan-long",
    page: "activityPlan",
    headings: activityPlanHeadings,
    element: <ActivityPlanDocument data={withActivities(25, 60)} />,
  },
  {
    name: "stress-supervisor-eval-overflow",
    page: "evaluation",
    headings: evaluationHeadings,
    element: (
      <SupervisorEvaluationDocument
        data={mockInternshipData}
        evaluation={{
          ...mockSupervisorEvaluationData,
          detailedComments: "comentário detalhado ".repeat(120).trim(),
        }}
      />
    ),
  },
];

export async function renderAll(outDir: string) {
  const manifest = [];

  for (const variant of variants) {
    const file = `${outDir}/${variant.name}.pdf`;
    await renderToFile(variant.element, file);

    const style = pageStyles[variant.page];
    manifest.push({
      name: variant.name,
      file,
      headings: variant.headings,
      coverPages: variant.coverPages ?? [],
      paddingTop: style.paddingTop,
      paddingBottom: style.paddingBottom,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
    });
  }

  await writeFile(
    `${outDir}/manifest.json`,
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  return manifest;
}
