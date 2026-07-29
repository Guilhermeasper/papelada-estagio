import {
  fonts,
  formatDatePtBr,
  getMonthName,
  PDFBulletList,
  PDFKeyValueTable,
  PDFLayout,
  PDFParagraph,
  PDFSection,
  PDFTable,
  type ColumnConfig,
  type KeyValueItem,
} from "@papelada-estagio/components/pdf";
import { PDF_CONTENT } from "@papelada-estagio/constants/pdf-content";
import { IInternshipData } from "@papelada-estagio/types";
import { View } from "@react-pdf/renderer";

interface ReportDocumentProps {
  data: IInternshipData;
}

export function ReportDocument({ data }: ReportDocumentProps) {
  const { student, company, general, content, evaluation, supervision } = data;
  const { report } = PDF_CONTENT;

  const [endYear, endMonth] = general.endDate.split("-").map(Number);
  const coverMonth = getMonthName(endMonth);
  const coverYear = endYear;

  const weeklyHours = general.hoursPerDay * general.workDays.length;

  const idItems: KeyValueItem[] = [
    { label: "Nome", value: student.fullName },
    {
      label: "Ano/Semestre de ingresso no curso",
      value: student.enrollmentYear,
    },
    { label: "Instituição concedente do estágio", value: company.companyName },
    {
      label: "Supervisor na instituição concedente",
      value: supervision.supervisorName,
    },
    { label: "Email do supervisor", value: supervision.supervisorEmail },
    {
      label: "Telefone para contato (supervisor)",
      value: supervision.supervisorPhone,
    },
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
    ...evaluation.grades.map((g) => ({
      item: g.item,
      grade: String(g.grade),
      observation: g.observation,
    })),
    {
      item: report.evaluationQuestions[0],
      grade: evaluation.flexibleSchedule ? "sim" : "não",
      observation: "",
    },
    {
      item: report.evaluationQuestions[1],
      grade: evaluation.reducedDuringExams ? "sim" : "não",
      observation: "",
    },
    {
      item: report.evaluationQuestions[2],
      grade: evaluation.requiresCompensation ? "sim" : "não",
      observation: "",
    },
    {
      item: report.evaluationQuestions[3],
      grade: evaluation.caresAboutAcademics ? "sim" : "não",
      observation: "",
    },
    {
      item: report.evaluationQuestions[4],
      grade: evaluation.recommendsPartnership ? "sim" : "não",
      observation: "",
    },
  ];

  return (
    <PDFLayout variant="report">
      {/* Cover Section */}
      <View style={{ marginTop: 50, marginBottom: 100, alignItems: "center" }}>
        <PDFParagraph
          style={{ fontSize: 24, marginBottom: 40, fontFamily: fonts.bold }}
          align="center"
        >
          {report.title}
        </PDFParagraph>
        <PDFParagraph style={{ fontSize: 16 }} align="center">
          Graduação em {student.course}
        </PDFParagraph>
        <PDFParagraph style={{ fontSize: 14, marginTop: 100 }} align="center">
          Recife, {coverMonth} de {coverYear}
        </PDFParagraph>
      </View>

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
      </PDFSection>

      {/* Cronograma */}
      <PDFSection title={report.sections.schedule}>
        <PDFParagraph>{report.text.scheduleIntro}</PDFParagraph>
        {content.schedule.map((item, index) => (
          <PDFParagraph key={index}>
            {item.period}: {item.description}
          </PDFParagraph>
        ))}
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
        <PDFTable columns={evalColumns} rows={evalRows as any} />
      </PDFSection>

      {/* Conclusão */}
      <PDFSection title={report.sections.conclusion}>
        <PDFParagraph>{content.conclusion}</PDFParagraph>
      </PDFSection>
    </PDFLayout>
  );
}
