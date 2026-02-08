import { Document, Text } from "@react-pdf/renderer";
import {
  PDFCommentsBox,
  PDFKeyValueTable,
  PDFPage,
  PDFSection,
  PDFSignatureLine,
  PDFTextHeader,
  formatDateLong,
  formatDatePtBr,
  type KeyValueItem,
  type Rating,
} from "../../../components/pdf";
import { PDF_CONTENT } from "../../../constants";
import type { IInternshipData } from "../../../types/types";
import { PDFCommentsSection } from "./PDFCommentsSection";
import { PDFDateSection } from "./PDFDateSection";
import { PDFEvalIntro } from "./PDFEvalIntro";
import { PDFGradeField } from "./PDFGradeField";
import { PDFRatingRow } from "./PDFRatingRow";

export interface IEvaluationFormData {
  communication?: Rating;
  attendance?: Rating;
  cooperation?: Rating;
  independence?: Rating;
  knowledgeLevel?: Rating;
  overallPerformance?: Rating;
  detailedComments?: string;
  finalGrade?: number;
  evaluationDate?: string;
}

export type EvaluationType = "supervisor" | "advisor";

interface EvaluationDocumentProps {
  type: EvaluationType;
  data: IInternshipData;
  evaluation: IEvaluationFormData;
}

export function EvaluationDocument({
  type,
  data,
  evaluation,
}: EvaluationDocumentProps) {
  const { evaluationDocument } = PDF_CONTENT;
  const config = evaluationDocument[type];
  const { student, company, general } = data;

  const getPersonName = () => {
    return type === "supervisor"
      ? data.supervision.supervisorName
      : data.supervision.advisorName;
  };

  const idItems: KeyValueItem[] = [
    { label: "Nome do aluno:", value: student.fullName },
    { label: "Curso do Aluno:", value: student.course },
    { label: "Nome da empresa:", value: company.companyName },
    {
      label: "Data de início do estágio:",
      value: formatDatePtBr(general.startDate),
    },
    {
      label: "Data de término do estágio:",
      value: formatDatePtBr(general.endDate),
    },
    { label: config.lastRowLabel, value: getPersonName() },
  ];

  return (
    <Document>
      <PDFPage variant="evaluation">
        <PDFTextHeader
          subtitle={evaluationDocument.shared.subtitle}
          title={config.title}
        />

        <PDFSection
          number="1"
          title={evaluationDocument.shared.sections.identification}
          titleStyle={{
            fontSize: 11,
            fontFamily: "Helvetica-Bold",
            marginBottom: 10,
          }}
        >
          <PDFKeyValueTable items={idItems} />
        </PDFSection>

        <PDFSection
          number="2"
          title={evaluationDocument.shared.sections.evaluation}
          titleStyle={{
            fontSize: 11,
            fontFamily: "Helvetica-Bold",
            marginBottom: 10,
          }}
        >
          <PDFEvalIntro>{evaluationDocument.shared.intro}</PDFEvalIntro>

          {evaluationDocument.shared.criteria.map((criterion) => (
            <PDFRatingRow
              key={criterion.key}
              label={criterion.label}
              selected={
                evaluation[criterion.key as keyof IEvaluationFormData] as
                  | Rating
                  | undefined
              }
            />
          ))}
        </PDFSection>

        <PDFCommentsSection>
          <PDFSection
            number="3"
            title={evaluationDocument.shared.comments.title}
            titleStyle={{
              fontSize: 11,
              fontFamily: "Helvetica-Bold",
              marginBottom: 10,
            }}
          >
            <PDFCommentsBox text={evaluation.detailedComments} lines={10} />
          </PDFSection>
        </PDFCommentsSection>

        <PDFGradeField sectionNumber={4} grade={evaluation.finalGrade} />

        <PDFDateSection>
          <Text>
            {evaluationDocument.shared.datePrefix}{" "}
            {formatDateLong(general.endDate)}
          </Text>
        </PDFDateSection>

        <PDFSignatureLine label={config.signatureLabel} />
      </PDFPage>
    </Document>
  );
}
