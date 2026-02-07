/**
 * ReportDocument - Relatório de Estágio Obrigatório PDF Component
 * Renders the internship report using @react-pdf/renderer
 */

import {
    Document,
    Image,
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
    PDFTable,
    type ColumnConfig,
    type KeyValueItem,
} from '../../shared/components/pdf';
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
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 10,
  },
  logoCin: {
    width: 97,
    height: 97,
  },
  logoUfpe: {
    width: 76,
    height: 120,
  },
  universityName: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  centerName: {
    fontSize: 18,
    textAlign: 'center',
    marginLeft: 30,
  },
  coverTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 80,
  },
  coverSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
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
      item: 'A concedente permite flexibilidade de horário?',
      grade: evaluation.flexibleSchedule ? 'sim' : 'não',
      observation: '',
    },
    {
      item: 'A concedente reduz sua jornada de trabalho no período próximo a provas e/ou trabalhos?',
      grade: evaluation.reducedDuringExams ? 'sim' : 'não',
      observation: '',
    },
    {
      item: 'Quando reduz sua jornada de trabalho por causa de provas e/ou trabalhos, a concedente exige que você compense estas horas?',
      grade: evaluation.requiresCompensation ? 'sim' : 'não',
      observation: '',
    },
    {
      item: 'A concedente se preocupa com seu desempenho acadêmico?',
      grade: evaluation.caresAboutAcademics ? 'sim' : 'não',
      observation: '',
    },
    {
      item: 'Você considera que a UFPE deve manter o convênio com a instituição concedente para que outros estudantes façam estágio nela?',
      grade: evaluation.recommendsPartnership ? 'sim' : 'não',
      observation: '',
    },
  ];

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.logoContainer}>
          <Image style={styles.logoCin} src="/logo_cin.png" />
          <Image style={styles.logoUfpe} src="/logo_ufpe.png" />
        </View>
        
        <Text style={styles.universityName}>Universidade Federal de Pernambuco</Text>
        <Text style={styles.centerName}>Centro de Informática</Text>

        <Text style={styles.coverTitle}>Relatório de Estágio Obrigatório</Text>
        
        <Text style={styles.coverSubtitle}>Graduação em {student.course}</Text>

        <View style={styles.coverFooter}>
          <Text>Recife</Text>
          <Text>{coverMonth}, {coverYear}</Text>
        </View>
      </Page>

      {/* Table of Contents */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.tocTitle}>Índice</Text>
        
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Identificação</Text>
          <Text style={styles.tocItemText}>3</Text>
        </View>
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Introdução</Text>
          <Text style={styles.tocItemText}>4</Text>
        </View>
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Objetivos</Text>
          <Text style={styles.tocItemText}>5</Text>
        </View>
        <View style={styles.tocSubItem}>
          <Text style={styles.tocSubItemText}>Gerais</Text>
          <Text style={styles.tocSubItemText}>5</Text>
        </View>
        <View style={styles.tocSubItem}>
          <Text style={styles.tocSubItemText}>Específicos</Text>
          <Text style={styles.tocSubItemText}>5</Text>
        </View>
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Cronograma</Text>
          <Text style={styles.tocItemText}>6</Text>
        </View>
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Material e Método</Text>
          <Text style={styles.tocItemText}>7</Text>
        </View>
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Desenvolvimento</Text>
          <Text style={styles.tocItemText}>8</Text>
        </View>
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Avaliação do Estágio</Text>
          <Text style={styles.tocItemText}>9</Text>
        </View>
        <View style={styles.tocItem}>
          <Text style={styles.tocItemText}>Conclusão</Text>
          <Text style={styles.tocItemText}>10</Text>
        </View>
      </Page>

      {/* Identificação - using PDFKeyValueTable */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Identificação</Text>
        <PDFKeyValueTable items={idItems} labelWidth={200} />
      </Page>

      {/* Introdução */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Introdução</Text>
        <Text style={styles.paragraph}>{content.introduction}</Text>
      </Page>

      {/* Objetivos - using PDFBulletList */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Objetivos</Text>
        
        <Text style={styles.h2}>Gerais</Text>
        <Text style={styles.paragraph}>{content.generalObjectives}</Text>
        
        <Text style={styles.h2}>Específicos</Text>
        <Text style={styles.paragraph}>
          Conforme estabelecido no Plano de Atividades, os objetivos específicos incluíram:
        </Text>
        <PDFBulletList items={content.objectives} />
      </Page>

      {/* Cronograma */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Cronograma</Text>
        <Text style={styles.paragraph}>
          O cronograma executado seguiu a dinâmica dos projetos da empresa, dividindo-se em três grandes fases:
        </Text>
        {content.schedule.map((item, index) => (
          <Text key={index} style={styles.paragraph}>
            {item.period}: {item.description}
          </Text>
        ))}
      </Page>

      {/* Material e Método */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Material e Método</Text>
        <Text style={styles.paragraph}>{content.methodology}</Text>
      </Page>

      {/* Desenvolvimento */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Desenvolvimento</Text>
        <Text style={styles.paragraph}>{content.development}</Text>
      </Page>

      {/* Avaliação do Estágio - using PDFTable */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Avaliação do Estágio</Text>
        <PDFTable columns={evalColumns} rows={evalRows} />
      </Page>

      {/* Conclusão */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Conclusão</Text>
        <Text style={styles.paragraph}>{content.conclusion}</Text>
      </Page>
    </Document>
  );
}
