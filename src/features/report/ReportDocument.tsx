/**
 * ReportDocument - Relatório de Estágio Obrigatório PDF Component
 * Renders the internship report using @react-pdf/renderer
 */

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import {
  colors,
  fonts,
  formatDatePtBr,
  getMonthName,
  PDFBulletList,
  PDFKeyValueTable,
  PDFLogoHeader,
  PDFSection,
  PDFTable,
  type ColumnConfig,
  type KeyValueItem,
} from '../../shared/components/pdf';
import { PDF_CONTENT } from '../../shared/constants/pdf-content';
import type { IInternshipData } from '../../shared/domain/types';

// ============================================
// Styles
// ============================================
const styles = StyleSheet.create({
  // Page
  page: {
    paddingTop: 70,
    paddingBottom: 70,
    paddingLeft: 85,
    paddingRight: 85,
    fontFamily: fonts.serif,
    fontSize: 12,
    color: colors.textBlack,
    lineHeight: 1.2,
  },
  // Cover page
  coverPage: {
    paddingTop: 70,
    paddingBottom: 70,
    paddingLeft: 85,
    paddingRight: 85,
    fontFamily: fonts.serif,
    fontSize: 12,
    color: colors.textBlack,
  },
  coverFooter: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: 100,
  },
  // Table of contents
  tocTitle: {
    fontSize: 16,
    fontFamily: fonts.serifBold,
    textAlign: 'center',
    marginBottom: 20,
  },
  tocItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingTop: 6,
  },
  tocItemText: {
    fontFamily: fonts.serifBold,
    fontSize: 12,
  },
  tocSubItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    marginLeft: 12,
  },
  tocSubItemText: {
    fontFamily: fonts.serifBold,
    fontSize: 11,
  },
  // Section headers
  h1: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.headerBlue,
    marginTop: 24,
    marginBottom: 10,
  },
  h2: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.subheaderBlue,
    marginTop: 10,
    marginBottom: 6,
  },
  // Content
  paragraph: {
    fontSize: 12,
    textAlign: 'justify',
    marginBottom: 10,
    lineHeight: 1.3,
  },
});

// ============================================
// Props Interface
// ============================================
interface ReportDocumentProps {
  data: IInternshipData;
}

// ============================================
// Main Component
// ============================================
export function ReportDocument({ data }: ReportDocumentProps) {
  const { student, company, general, content, evaluation, supervision } = data;
  const { report, header } = PDF_CONTENT;

  // Get current date for cover
  const endDate = new Date(general.endDate);
  const coverMonth = getMonthName(endDate.getMonth() + 1);
  const coverYear = endDate.getFullYear();

  // Calculate weekly hours
  const weeklyHours = general.hoursPerDay * 5;

  // ID table items using shared component
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

  // Evaluation table columns
  const evalColumns: ColumnConfig[] = [
    { key: 'item', header: 'Item', width: 175 },
    { key: 'grade', header: 'Nota', width: 47, align: 'center', bold: true },
    { key: 'observation', header: 'Observação', width: 214 },
  ];

  // Evaluation rows: combine grades and yes/no questions
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
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <PDFLogoHeader 
           logos={[
             { src: '/logo_cin.png', width: 97, height: 97 },
             { src: '/logo_ufpe.png', width: 76, height: 120 }
           ]}
        />
        
        <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 10 }}>{header.university}</Text>
        <Text style={{ fontSize: 18, textAlign: 'center', marginLeft: 30 }}>{header.institution}</Text>

        <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 80 }}>{report.title}</Text>
        
        <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 40 }}>Graduação em {student.course}</Text>

        <View style={styles.coverFooter}>
          <Text>Recife</Text>
          <Text>{coverMonth}, {coverYear}</Text>
        </View>
      </Page>

      {/* Table of Contents */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.tocTitle}>{report.toc.title}</Text>
        
        {report.toc.items.map((item, index) => {
           if (item.indent) {
             return (
               <View key={index} style={styles.tocSubItem}>
                 <Text style={styles.tocSubItemText}>{item.label}</Text>
                 <Text style={styles.tocSubItemText}>{item.page}</Text>
               </View>
             );
           }
           return (
             <View key={index} style={styles.tocItem}>
                <Text style={styles.tocItemText}>{item.label}</Text>
                <Text style={styles.tocItemText}>{item.page}</Text>
             </View>
           );
        })}
      </Page>

      {/* Identificação - using PDFKeyValueTable */}
      <Page size="A4" style={styles.page}>
        <PDFSection title={report.sections.identification} titleStyle={styles.h1}>
             <PDFKeyValueTable items={idItems} labelWidth={200} />
        </PDFSection>
      </Page>

      {/* Introdução */}
      <Page size="A4" style={styles.page}>
        <PDFSection title={report.sections.introduction} titleStyle={styles.h1}>
            <Text style={styles.paragraph}>{content.introduction}</Text>
        </PDFSection>
      </Page>

      {/* Objetivos - using PDFBulletList */}
      <Page size="A4" style={styles.page}>
        <PDFSection title={report.sections.objectives} titleStyle={styles.h1}>
            <Text style={styles.h2}>{report.sections.generalObjectives}</Text>
            <Text style={styles.paragraph}>{content.generalObjectives}</Text>
            
            <Text style={styles.h2}>{report.sections.specificObjectives}</Text>
            <Text style={styles.paragraph}>
              {report.text.specificObjectivesIntro}
            </Text>
            <PDFBulletList items={content.objectives} />
        </PDFSection>
      </Page>

      {/* Cronograma */}
      <Page size="A4" style={styles.page}>
        <PDFSection title={report.sections.schedule} titleStyle={styles.h1}>
            <Text style={styles.paragraph}>
              {report.text.scheduleIntro}
            </Text>
            {content.schedule.map((item, index) => (
              <Text key={index} style={styles.paragraph}>
                {item.period}: {item.description}
              </Text>
            ))}
        </PDFSection>
      </Page>

      {/* Material e Método */}
      <Page size="A4" style={styles.page}>
         <PDFSection title={report.sections.methodology} titleStyle={styles.h1}>
            <Text style={styles.paragraph}>{content.methodology}</Text>
         </PDFSection>
      </Page>

      {/* Desenvolvimento */}
      <Page size="A4" style={styles.page}>
         <PDFSection title={report.sections.development} titleStyle={styles.h1}>
            <Text style={styles.paragraph}>{content.development}</Text>
         </PDFSection>
      </Page>

      {/* Avaliação do Estágio - using PDFTable */}
      <Page size="A4" style={styles.page}>
         <PDFSection title={report.sections.evaluation} titleStyle={styles.h1}>
            <PDFTable columns={evalColumns} rows={evalRows} />
         </PDFSection>
      </Page>

      {/* Conclusão */}
      <Page size="A4" style={styles.page}>
         <PDFSection title={report.sections.conclusion} titleStyle={styles.h1}>
            <Text style={styles.paragraph}>{content.conclusion}</Text>
         </PDFSection>
      </Page>
    </Document>
  );
}
