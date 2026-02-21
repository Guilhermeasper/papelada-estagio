import {
  fonts,
  formatDateLong,
  formatDatePtBr,
  PDFCommentsBox,
  PDFKeyValueTable,
  PDFLayout,
  PDFParagraph,
  PDFSection,
  PDFSignatureLine,
  PDFTextHeader,
  type KeyValueItem,
  type Rating,
} from "@papelada-estagio/components/pdf";
import { PDF_CONTENT } from "@papelada-estagio/constants";
import type { IInternshipData } from "@papelada-estagio/types";
import { Text, View } from "@react-pdf/renderer";
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
    { label: "Nome do aluno", value: student.fullName },
    { label: "Curso do Aluno", value: student.course },
    { label: "Nome da empresa", value: company.companyName },
    {
      label: "Data de início do estágio",
      value: formatDatePtBr(general.startDate),
    },
    {
      label: "Data de término do estágio",
      value: formatDatePtBr(general.endDate),
    },
    { label: config.lastRowLabel, value: getPersonName() },
  ];

  return (
    <PDFLayout variant="evaluation">
      <PDFTextHeader
        subtitle={evaluationDocument.shared.subtitle}
        title={config.title}
      />

      <PDFSection
        number="1"
        title={evaluationDocument.shared.sections.identification}
        titleStyle={{
          fontSize: 11,
          fontFamily: fonts.bold,
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
          fontFamily: fonts.bold,
          marginBottom: 10,
        }}
      >
        <PDFParagraph style={{ fontSize: 10, marginBottom: 15 }}>
          {evaluationDocument.shared.intro}
        </PDFParagraph>

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

      <PDFSection
        number="3"
        title={evaluationDocument.shared.comments.title}
        titleStyle={{
          fontSize: 11,
          fontFamily: fonts.bold,
          marginBottom: 10,
        }}
      >
        <PDFCommentsBox text={evaluation.detailedComments} lines={10} />
      </PDFSection>

      <PDFSection
        number="4"
        title="NOTA"
        titleStyle={{
          fontSize: 11,
          fontFamily: fonts.bold,
          marginBottom: 10,
        }}
      >
        <PDFParagraph>
          Nota atribuída ao estagiário: {evaluation.finalGrade ?? ""}
        </PDFParagraph>
      </PDFSection>

      <View style={{ marginTop: 20, marginBottom: 40 }}>
        <Text>
          {evaluationDocument.shared.datePrefix}{" "}
          {formatDateLong(general.endDate)}
        </Text>
      </View>

      <PDFSignatureLine label={config.signatureLabel} centered />
    </PDFLayout>
  );
}
