import {
  fonts,
  formatDatePtBr,
  getMonthName,
  PDFBulletList,
  PDFKeyValueTable,
  PDFLayout,
  PDFParagraph,
  PDFSection,
  PDFSignatureLine,
  PDFTable,
  type ColumnConfig,
  type KeyValueItem,
} from "@papelada-estagio/components/pdf";
import {
  EVALUATION_ANSWER_KEYS,
  getApplicableGrades,
  regimeHasSupervisor,
} from "@papelada-estagio/constants/internshipRules";
import { PDF_CONTENT } from "@papelada-estagio/constants/pdf-content";
import { IInternshipData } from "@papelada-estagio/types";
import { formatPeriod } from "@papelada-estagio/utils/dateUtils";
import { View } from "@react-pdf/renderer";

interface ReportDocumentProps {
  data: IInternshipData;
}

function formatAnswer(answer: boolean | null): string {
  if (answer === null) return "";
  return answer ? "sim" : "não";
}

export function ReportDocument({ data }: ReportDocumentProps) {
  const {
    framing,
    student,
    company,
    general,
    content,
    evaluation,
    supervision,
  } = data;
  const { header, report } = PDF_CONTENT;

  const [endYear, endMonth] = general.endDate.split("-").map(Number);
  const coverMonth = getMonthName(endMonth);
  const coverYear = endYear;

  const weeklyHours = general.hoursPerDay * general.workDays.length;

  const supervisorItems: KeyValueItem[] = regimeHasSupervisor(framing.regime)
    ? [
        {
          label: "Supervisor na instituição concedente",
          value: supervision.supervisorName,
        },
        { label: "Email do supervisor", value: supervision.supervisorEmail },
        {
          label: "Telefone para contato (supervisor)",
          value: supervision.supervisorPhone,
        },
      ]
    : [];

  const idItems: KeyValueItem[] = [
    { label: "Nome", value: student.fullName },
    {
      label: "Ano/Semestre de ingresso no curso",
      value: student.enrollmentYear,
    },
    { label: "Instituição concedente do estágio", value: company.companyName },
    ...supervisorItems,
    {
      label: "Data de início do estágio",
      value: formatDatePtBr(general.startDate),
    },
    {
      label: "Data de término do estágio",
      value: formatDatePtBr(general.endDate),
    },
    { label: "Carga horária semanal", value: `${weeklyHours} horas` },
    { label: "Professor Orientador", value: supervision.advisorName },
  ];

  const evalColumns: ColumnConfig[] = [
    { key: "item", header: "Item", width: 175 },
    { key: "grade", header: "Nota", width: 47, align: "center", bold: true },
    { key: "observation", header: "Observação", width: 214 },
  ];

  const evalRows = [
    ...getApplicableGrades(evaluation.grades, framing.regime).map((g) => ({
      item: g.item,
      grade: g.grade === null ? "" : String(g.grade),
      observation: g.observation,
    })),
    ...EVALUATION_ANSWER_KEYS.map((key, index) => ({
      item: report.evaluationQuestions[index],
      grade: formatAnswer(evaluation[key].answer),
      observation: evaluation[key].comment,
    })),
  ];

  return (
    <PDFLayout variant="report">
      {/* Cover Section */}
      <View style={{ marginTop: 50, marginBottom: 100, alignItems: "center" }}>
        <PDFParagraph
          style={{ fontSize: 16, marginBottom: 5, fontFamily: fonts.bold }}
          align="center"
        >
          {report.university}
        </PDFParagraph>
        <PDFParagraph style={{ fontSize: 14, marginBottom: 80 }} align="center">
          {header.institution}
        </PDFParagraph>
        <PDFParagraph
          style={{ fontSize: 24, marginBottom: 40, fontFamily: fonts.bold }}
          align="center"
        >
          {report.title}
        </PDFParagraph>
        <PDFParagraph style={{ fontSize: 16 }} align="center">
          Graduação em {framing.course}
        </PDFParagraph>
        <PDFParagraph style={{ fontSize: 14, marginTop: 100 }} align="center">
          Recife, {coverMonth} de {coverYear}
        </PDFParagraph>
      </View>

      <View break />

      {/* Índice */}
      <PDFSection title={report.toc.title}>
        {report.toc.items.map((item, index) => (
          <PDFParagraph
            key={index}
            style={{ marginLeft: item.indent ? 20 : 0, marginBottom: 4 }}
          >
            {item.label}
          </PDFParagraph>
        ))}
      </PDFSection>

      <View break />

      {/* Identificação */}
      <PDFSection title={report.sections.identification}>
        <PDFKeyValueTable items={idItems} labelWidth={200} />
      </PDFSection>

      {/* Introdução */}
      <PDFSection title={report.sections.introduction}>
        <PDFParagraph>{content.introduction}</PDFParagraph>
      </PDFSection>

      {/* Objetivos */}
      <PDFSection title={report.sections.objectives}>
        <PDFParagraph style={{ fontFamily: fonts.bold, marginBottom: 5 }}>
          {report.sections.generalObjectives}
        </PDFParagraph>
        <PDFParagraph>{content.generalObjectives}</PDFParagraph>

        <PDFParagraph
          style={{
            fontFamily: fonts.bold,
            marginTop: 15,
            marginBottom: 5,
          }}
        >
          {report.sections.specificObjectives}
        </PDFParagraph>
        <PDFParagraph>{report.text.specificObjectivesIntro}</PDFParagraph>
        <PDFBulletList items={content.objectives} />
        <PDFParagraph>{content.specificObjectives}</PDFParagraph>
      </PDFSection>

      {/* Cronograma */}
      <PDFSection title={report.sections.schedule}>
        <PDFParagraph>{report.text.scheduleIntro}</PDFParagraph>
        {content.schedule.map((item, index) => (
          <PDFParagraph key={index}>
            {formatPeriod(item.periodStart, item.periodEnd)}: {item.description}
          </PDFParagraph>
        ))}
        <PDFParagraph>{content.scheduleDiscussion}</PDFParagraph>
      </PDFSection>

      {/* Metodologia */}
      <PDFSection title={report.sections.methodology}>
        <PDFParagraph>{content.methodology}</PDFParagraph>
      </PDFSection>

      {/* Desenvolvimento */}
      <PDFSection title={report.sections.development}>
        <PDFParagraph>{content.development}</PDFParagraph>
      </PDFSection>

      {/* Avaliação */}
      <PDFSection title={report.sections.evaluation}>
        <PDFTable columns={evalColumns} rows={evalRows} />
      </PDFSection>

      {/* Conclusão */}
      <PDFSection title={report.sections.conclusion}>
        <PDFParagraph>{content.conclusion}</PDFParagraph>
      </PDFSection>

      {/* Referências */}
      <PDFSection title={report.sections.references}>
        <PDFParagraph>{content.references || report.noReferences}</PDFParagraph>
      </PDFSection>

      <PDFSignatureLine
        label={report.studentSignature}
        subLabel={`(${student.fullName})`}
        style={{ marginTop: 40 }}
      />
    </PDFLayout>
  );
}
