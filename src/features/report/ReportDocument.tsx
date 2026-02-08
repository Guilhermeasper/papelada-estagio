

import { View } from '@react-pdf/renderer';
import {
  formatDatePtBr,
  getMonthName,
  PDFBulletList,
  PDFKeyValueTable,
  PDFTable,
  type ColumnConfig,
  type KeyValueItem,
} from '../../components/pdf';
import {
  DocSectionTitle,
  DocText,
  DocTitle
} from '../../components/pdf/atoms';
import { DocumentLayout } from '../../components/pdf/DocumentLayout';
import { PDF_CONTENT } from '../../constants/pdf-content';
import { IInternshipData } from '../../types/types';

interface ReportDocumentProps {
  data: IInternshipData;
}

export function ReportDocument({ data }: ReportDocumentProps) {
  const { student, company, general, content, evaluation, supervision } = data;
  const { report } = PDF_CONTENT;

  const endDate = new Date(general.endDate);
  const coverMonth = getMonthName(endDate.getMonth() + 1);
  const coverYear = endDate.getFullYear();

  const weeklyHours = general.hoursPerDay * 5;

  const idItems: KeyValueItem[] = [
    { label: 'Nome', value: student.fullName },
    { label: 'Ano/Semestre de ingresso no curso', value: student.enrollmentYear },
    { label: 'Instituição concedente do estágio', value: company.companyName },
    { label: 'Supervisor na instituição concedente', value: supervision.supervisorName },
    { label: 'Email do supervisor', value: supervision.supervisorEmail },
    { label: 'Telefone para contato (supervisor)', value: supervision.supervisorPhone },
    { label: 'Data de início do estágio', value: formatDatePtBr(general.startDate) },
    { label: 'Data de término do estágio', value: formatDatePtBr(general.endDate) },
    { label: 'Carga horária semanal', value: `${weeklyHours} horas` },
    { label: 'Professor Orientador', value: supervision.advisorName },
  ];

  const evalColumns: ColumnConfig[] = [
    { key: 'item', header: 'Item', width: 175 },
    { key: 'grade', header: 'Nota', width: 47, align: 'center', bold: true },
    { key: 'observation', header: 'Observação', width: 214 },
  ];

  const evalRows = [
    ...evaluation.grades.map((g) => ({
      item: g.item,
      grade: String(g.grade),
      observation: g.observation,
    })),
    {
      item: report.evaluationQuestions[0],
      grade: evaluation.flexibleSchedule ? 'sim' : 'não',
      observation: '',
    },
    {
      item: report.evaluationQuestions[1],
      grade: evaluation.reducedDuringExams ? 'sim' : 'não',
      observation: '',
    },
    {
      item: report.evaluationQuestions[2],
      grade: evaluation.requiresCompensation ? 'sim' : 'não',
      observation: '',
    },
    {
      item: report.evaluationQuestions[3],
      grade: evaluation.caresAboutAcademics ? 'sim' : 'não',
      observation: '',
    },
    {
      item: report.evaluationQuestions[4],
      grade: evaluation.recommendsPartnership ? 'sim' : 'não',
      observation: '',
    },
  ];

  return (
    <DocumentLayout>
      {/* Cover Section */}
      <View style={{ marginTop: 50, marginBottom: 100, alignItems: 'center' }}>
        <DocTitle style={{ fontSize: 24, marginBottom: 40 }}>{report.title}</DocTitle>
        <DocText style={{ fontSize: 16, textAlign: 'center' }}>Graduação em {student.course}</DocText>
        <DocText style={{ fontSize: 14, textAlign: 'center', marginTop: 100 }}>
          Recife, {coverMonth} de {coverYear}
        </DocText>
      </View>

      <View break />

      {/* Identificação */}
      <DocSectionTitle>{report.sections.identification}</DocSectionTitle>
      <PDFKeyValueTable items={idItems} labelWidth={200} />
      
      <View break />

      {/* Introdução */}
      <DocSectionTitle>{report.sections.introduction}</DocSectionTitle>
      <DocText>{content.introduction}</DocText>

      <View break />

      {/* Objetivos */}
      <DocSectionTitle>{report.sections.objectives}</DocSectionTitle>
      
      <DocText style={{ fontFamily: 'Helvetica-Bold', marginBottom: 5 }}>{report.sections.generalObjectives}</DocText>
      <DocText>{content.generalObjectives}</DocText>
      
      <DocText style={{ fontFamily: 'Helvetica-Bold', marginTop: 15, marginBottom: 5 }}>{report.sections.specificObjectives}</DocText>
      <DocText>{report.text.specificObjectivesIntro}</DocText>
      <PDFBulletList items={content.objectives} />

      <View break />

      {/* Cronograma */}
      <DocSectionTitle>{report.sections.schedule}</DocSectionTitle>
      <DocText>{report.text.scheduleIntro}</DocText>
      {content.schedule.map((item, index) => (
        <DocText key={index}>
          {item.period}: {item.description}
        </DocText>
      ))}

      <View break />

      {/* Metodologia */}
      <DocSectionTitle>{report.sections.methodology}</DocSectionTitle>
      <DocText>{content.methodology}</DocText>

      <View break />

      {/* Desenvolvimento */}
      <DocSectionTitle>{report.sections.development}</DocSectionTitle>
      <DocText>{content.development}</DocText>

      <View break />

      {/* Avaliação */}
      <DocSectionTitle>{report.sections.evaluation}</DocSectionTitle>
      <PDFTable columns={evalColumns} rows={evalRows} />

      <View break />

      {/* Conclusão */}
      <DocSectionTitle>{report.sections.conclusion}</DocSectionTitle>
      <DocText>{content.conclusion}</DocText>
    </DocumentLayout>
  );
}
