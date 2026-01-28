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
import type { IInternshipData } from '../../shared/domain/types';

// ============================================
// Colors
// ============================================
const colors = {
  textBlack: '#000000',
  headerBlue: '#335b8a',
  subheaderBlue: '#4f81bd',
  white: '#FFFFFF',
};

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
    fontFamily: 'Times-Roman',
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
    fontFamily: 'Times-Roman',
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
    fontFamily: 'Times-Bold',
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
    fontFamily: 'Times-Bold',
    fontSize: 12,
  },
  tocSubItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    marginLeft: 12,
  },
  tocSubItemText: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
  },
  // Section headers (Calibri-like for headers per HTML)
  h1: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: colors.headerBlue,
    marginTop: 24,
    marginBottom: 10,
  },
  h2: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
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
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    marginLeft: 36,
    paddingRight: 20,
  },
  bullet: {
    width: 18,
  },
  bulletText: {
    flex: 1,
    textAlign: 'justify',
  },
  // Identification table
  idTable: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.textBlack,
  },
  idTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.textBlack,
    minHeight: 28,
  },
  idTableRowLast: {
    flexDirection: 'row',
    minHeight: 28,
  },
  idTableLabel: {
    width: 200,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: colors.textBlack,
    justifyContent: 'center',
  },
  idTableValue: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  // Evaluation table
  evalTable: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.textBlack,
  },
  evalTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.textBlack,
  },
  evalTableRowLast: {
    flexDirection: 'row',
  },
  evalTableHeader: {
    backgroundColor: colors.white,
  },
  evalColItem: {
    width: 175,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: colors.textBlack,
  },
  evalColGrade: {
    width: 47,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: colors.textBlack,
    textAlign: 'center',
    justifyContent: 'center',
  },
  evalColObs: {
    width: 214,
    padding: 5,
  },
  evalHeaderText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10.5,
    textAlign: 'center',
  },
  evalCellText: {
    fontFamily: 'Helvetica',
    fontSize: 10.5,
  },
  evalCellTextBold: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10.5,
  },
});

// ============================================
// Props Interface
// ============================================
interface ReportDocumentProps {
  data: IInternshipData;
}

// ============================================
// Helper Functions
// ============================================
function formatDatePtBr(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function getMonthName(month: number): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return months[month - 1] || '';
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

      {/* Identificação */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Identificação</Text>
        
        <View style={styles.idTable}>
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}><Text>Nome</Text></View>
            <View style={styles.idTableValue}><Text>{student.fullName}</Text></View>
          </View>
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}><Text>Ano/Semestre de ingresso no curso</Text></View>
            <View style={styles.idTableValue}><Text>{student.enrollmentYear}</Text></View>
          </View>
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}><Text>Instituição concedente do estágio</Text></View>
            <View style={styles.idTableValue}><Text>{company.companyName}</Text></View>
          </View>
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}><Text>Supervisor na instituição concedente</Text></View>
            <View style={styles.idTableValue}><Text>{supervision.supervisorName}</Text></View>
          </View>
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}><Text>Email do supervisor</Text></View>
            <View style={styles.idTableValue}><Text>{supervision.supervisorEmail}</Text></View>
          </View>
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}><Text>Telefone para contato (supervisor)</Text></View>
            <View style={styles.idTableValue}><Text>{supervision.supervisorPhone}</Text></View>
          </View>
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}><Text>Data de início do estágio</Text></View>
            <View style={styles.idTableValue}><Text>{formatDatePtBr(general.startDate)}</Text></View>
          </View>
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}><Text>Data de término do estágio</Text></View>
            <View style={styles.idTableValue}><Text>{formatDatePtBr(general.endDate)}</Text></View>
          </View>
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}><Text>Carga horária semanal</Text></View>
            <View style={styles.idTableValue}><Text>{weeklyHours} horas</Text></View>
          </View>
          <View style={styles.idTableRowLast}>
            <View style={styles.idTableLabel}><Text>Professor Orientador</Text></View>
            <View style={styles.idTableValue}><Text>{supervision.advisorName}</Text></View>
          </View>
        </View>
      </Page>

      {/* Introdução */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Introdução</Text>
        <Text style={styles.paragraph}>{content.introduction}</Text>
      </Page>

      {/* Objetivos */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Objetivos</Text>
        
        <Text style={styles.h2}>Gerais</Text>
        <Text style={styles.paragraph}>{content.generalObjectives}</Text>
        
        <Text style={styles.h2}>Específicos</Text>
        <Text style={styles.paragraph}>
          Conforme estabelecido no Plano de Atividades, os objetivos específicos incluíram:
        </Text>
        {content.objectives.map((obj, index) => (
          <View key={index} style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{obj}</Text>
          </View>
        ))}
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

      {/* Avaliação do Estágio */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Avaliação do Estágio</Text>
        
        <View style={styles.evalTable}>
          {/* Header */}
          <View style={[styles.evalTableRow, styles.evalTableHeader]}>
            <View style={styles.evalColItem}>
              <Text style={styles.evalHeaderText}>Item</Text>
            </View>
            <View style={styles.evalColGrade}>
              <Text style={styles.evalHeaderText}>Nota</Text>
            </View>
            <View style={styles.evalColObs}>
              <Text style={styles.evalHeaderText}>Observação</Text>
            </View>
          </View>
          
          {/* Rows */}
          {evaluation.grades.map((grade, index) => (
            <View 
              key={index} 
              style={styles.evalTableRow}
            >
              <View style={styles.evalColItem}>
                <Text style={styles.evalCellTextBold}>{grade.item}</Text>
              </View>
              <View style={styles.evalColGrade}>
                <Text style={styles.evalCellTextBold}>{grade.grade}</Text>
              </View>
              <View style={styles.evalColObs}>
                <Text style={styles.evalCellText}>{grade.observation}</Text>
              </View>
            </View>
          ))}

          {/* Yes/No questions */}
          <View style={styles.evalTableRow}>
            <View style={styles.evalColItem}>
              <Text style={styles.evalCellTextBold}>A concedente permite flexibilidade de horário?</Text>
            </View>
            <View style={styles.evalColGrade}>
              <Text style={styles.evalCellTextBold}>{evaluation.flexibleSchedule ? 'sim' : 'não'}</Text>
            </View>
            <View style={styles.evalColObs}><Text></Text></View>
          </View>
          <View style={styles.evalTableRow}>
            <View style={styles.evalColItem}>
              <Text style={styles.evalCellTextBold}>A concedente reduz sua jornada de trabalho no período próximo a provas e/ou trabalhos?</Text>
            </View>
            <View style={styles.evalColGrade}>
              <Text style={styles.evalCellTextBold}>{evaluation.reducedDuringExams ? 'sim' : 'não'}</Text>
            </View>
            <View style={styles.evalColObs}><Text></Text></View>
          </View>
          <View style={styles.evalTableRow}>
            <View style={styles.evalColItem}>
              <Text style={styles.evalCellTextBold}>Quando reduz sua jornada de trabalho por causa de provas e/ou trabalhos, a concedente exige que você compense estas horas?</Text>
            </View>
            <View style={styles.evalColGrade}>
              <Text style={styles.evalCellTextBold}>{evaluation.requiresCompensation ? 'sim' : 'não'}</Text>
            </View>
            <View style={styles.evalColObs}><Text></Text></View>
          </View>
          <View style={styles.evalTableRow}>
            <View style={styles.evalColItem}>
              <Text style={styles.evalCellTextBold}>A concedente se preocupa com seu desempenho acadêmico?</Text>
            </View>
            <View style={styles.evalColGrade}>
              <Text style={styles.evalCellTextBold}>{evaluation.caresAboutAcademics ? 'sim' : 'não'}</Text>
            </View>
            <View style={styles.evalColObs}><Text></Text></View>
          </View>
          <View style={styles.evalTableRowLast}>
            <View style={styles.evalColItem}>
              <Text style={styles.evalCellTextBold}>Você considera que a UFPE deve manter o convênio com a instituição concedente para que outros estudantes façam estágio nela?</Text>
            </View>
            <View style={styles.evalColGrade}>
              <Text style={styles.evalCellTextBold}>{evaluation.recommendsPartnership ? 'sim' : 'não'}</Text>
            </View>
            <View style={styles.evalColObs}><Text></Text></View>
          </View>
        </View>
      </Page>

      {/* Conclusão */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Conclusão</Text>
        <Text style={styles.paragraph}>{content.conclusion}</Text>
      </Page>
    </Document>
  );
}
