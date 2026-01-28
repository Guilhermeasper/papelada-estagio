/**
 * AdvisorEvaluationDocument - Avaliação do Professor Orientador PDF Component
 * Renders the advisor evaluation form using @react-pdf/renderer
 */

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import type { IInternshipData } from '../../shared/domain/types';

// ============================================
// Rating Type
// ============================================
export type Rating = 'Ótimo' | 'Bom' | 'Regular' | 'Ruim';

// ============================================
// Advisor Evaluation Data
// ============================================
export interface IAdvisorEvaluationData {
  communication?: Rating;
  attendance?: Rating;
  cooperation?: Rating;
  independence?: Rating;
  knowledgeLevel?: Rating;
  overallPerformance?: Rating;
  detailedComments?: string;
  finalGrade?: number;
  evaluationDate?: string; // ISO format
}

// ============================================
// Colors
// ============================================
const colors = {
  textBlack: '#000000',
  white: '#FFFFFF',
};

// ============================================
// Styles
// ============================================
const styles = StyleSheet.create({
  page: {
    paddingTop: 73,
    paddingBottom: 79,
    paddingLeft: 72,
    paddingRight: 79,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: colors.textBlack,
    lineHeight: 1.08,
  },
  // Header
  headerSubtitle: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Section numbering
  sectionNumber: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    marginLeft: 0,
  },
  // Identification table
  idTable: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.textBlack,
    marginBottom: 15,
  },
  idTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.textBlack,
    minHeight: 25,
  },
  idTableRowLast: {
    flexDirection: 'row',
    minHeight: 25,
  },
  idTableLabel: {
    width: 169,
    padding: 7,
    paddingTop: 12,
    borderRightWidth: 1,
    borderRightColor: colors.textBlack,
  },
  idTableValue: {
    flex: 1,
    padding: 7,
    paddingTop: 12,
  },
  // Evaluation section
  evalQuestion: {
    marginBottom: 12,
    marginLeft: 0,
  },
  evalQuestionText: {
    fontSize: 11,
    marginBottom: 8,
  },
  evalCriterionLabel: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  evalRatingRow: {
    flexDirection: 'row',
    fontSize: 11,
    marginBottom: 15,
  },
  evalRatingOption: {
    marginRight: 20,
  },
  // Comments table
  commentsTable: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.textBlack,
    marginBottom: 15,
    marginTop: 10,
  },
  commentsRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textBlack,
    minHeight: 25,
    padding: 5,
  },
  commentsRowLast: {
    minHeight: 25,
    padding: 5,
  },
  // Final grade
  finalGradeSection: {
    marginTop: 20,
    marginLeft: 0,
  },
  // Date and signature
  dateSection: {
    marginTop: 40,
    textAlign: 'center',
  },
  signatureLine: {
    marginTop: 50,
    textAlign: 'center',
  },
  signatureText: {
    fontSize: 11,
    textAlign: 'center',
  },
});

// ============================================
// Helper Functions
// ============================================
function formatDateLong(isoDate?: string): string {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const day = date.getDate();
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

function formatDatePtBr(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function renderRating(selected?: Rating): string {
  const options: Rating[] = ['Ótimo', 'Bom', 'Regular', 'Ruim'];
  return options.map((option) => 
    `${option} ( ${option === selected ? 'X' : ' '} )`
  ).join('      ');
}

// Split text into lines for the comments table
function splitTextIntoLines(text: string | undefined, numLines: number): string[] {
  if (!text) {
    return Array(numLines).fill('\u00A0');
  }
  
  // Approximate characters per line (around 90 chars fits in the table row)
  const charsPerLine = 84;
  const lines: string[] = [];
  let remaining = text;
  
  for (let i = 0; i < numLines; i++) {
    if (remaining.length === 0) {
      lines.push('\u00A0');
    } else if (remaining.length <= charsPerLine) {
      lines.push(remaining);
      remaining = '';
    } else {
      // Find a good break point (space) near the limit
      let breakPoint = charsPerLine;
      while (breakPoint > 0 && remaining[breakPoint] !== ' ') {
        breakPoint--;
      }
      if (breakPoint === 0) breakPoint = charsPerLine; // No space found, break at limit
      
      lines.push(remaining.substring(0, breakPoint).trim());
      remaining = remaining.substring(breakPoint).trim();
    }
  }
  
  return lines;
}

// ============================================
// Props Interface
// ============================================
interface AdvisorEvaluationDocumentProps {
  data: IInternshipData;
  evaluation: IAdvisorEvaluationData;
}

// ============================================
// Evaluation Criteria
// ============================================
const evaluationCriteria = [
  { key: 'communication', label: 'Facilidade de comunicação' },
  { key: 'attendance', label: 'Assiduidade' },
  { key: 'cooperation', label: 'Disposição para ajudar/cooperar com colaboradores' },
  { key: 'independence', label: 'Capacidade para desenvolver as atividades sem depender dos outros' },
  { key: 'knowledgeLevel', label: 'Nível de conhecimento para desenvolver as atividades relacionadas ao estágio' },
  { key: 'overallPerformance', label: 'Avaliação geral do desempenho do estagiário na execução das atividades' },
] as const;

// ============================================
// Main Component
// ============================================
export function AdvisorEvaluationDocument({ data, evaluation }: AdvisorEvaluationDocumentProps) {
  const { student, company, general, supervision } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.headerSubtitle}>Estágio Supervisionado</Text>
        <Text style={styles.headerTitle}>Avaliação do Professor Orientador</Text>

        {/* 1. Identificação */}
        <Text style={styles.sectionNumber}>1. Identificação</Text>
        
        <View style={styles.idTable}>
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}>
              <Text>Nome do aluno:</Text>
            </View>
            <View style={styles.idTableValue}>
              <Text>{student.fullName}</Text>
            </View>
          </View>
          
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}>
              <Text>Curso do Aluno:</Text>
            </View>
            <View style={styles.idTableValue}>
              <Text>{student.course}</Text>
            </View>
          </View>
          
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}>
              <Text>Nome da empresa:</Text>
            </View>
            <View style={styles.idTableValue}>
              <Text>{company.companyName}</Text>
            </View>
          </View>
          
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}>
              <Text>Data de início do estágio:</Text>
            </View>
            <View style={styles.idTableValue}>
              <Text>{formatDatePtBr(general.startDate)}</Text>
            </View>
          </View>
          
          <View style={styles.idTableRow}>
            <View style={styles.idTableLabel}>
              <Text>Data de término do estágio:</Text>
            </View>
            <View style={styles.idTableValue}>
              <Text>{formatDatePtBr(general.endDate)}</Text>
            </View>
          </View>
          
          <View style={styles.idTableRowLast}>
            <View style={styles.idTableLabel}>
              <Text>Nome do Professor Orientador:</Text>
            </View>
            <View style={styles.idTableValue}>
              <Text>{supervision.advisorName}</Text>
            </View>
          </View>
        </View>

        {/* 2. Avaliação */}
        <Text style={styles.sectionNumber}>2. Avaliação</Text>
        
        <Text style={[styles.evalQuestionText, { marginBottom: 15 }]}>
          Como você avalia o desempenho do estagiário em cada um dos aspectos a seguir:
        </Text>

        {evaluationCriteria.map((criterion) => (
          <View key={criterion.key} style={styles.evalQuestion}>
            <Text style={styles.evalCriterionLabel}>{criterion.label}</Text>
            <Text style={styles.evalRatingRow}>
              {renderRating(evaluation[criterion.key as keyof typeof evaluation] as Rating)}
            </Text>
          </View>
        ))}

        {/* 3. Comentários */}
        <Text style={[styles.sectionNumber, { marginTop: 20 }]}>
          3. Caso deseje, utilize o espaço abaixo para uma avaliação mais detalhada sobre o estagiário.
        </Text>
        
        <View style={styles.commentsTable}>
          {splitTextIntoLines(evaluation.detailedComments, 10).map((line, index) => (
            <View 
              key={index} 
              style={index === 9 ? styles.commentsRowLast : styles.commentsRow}
            >
              <Text>{line}</Text>
            </View>
          ))}
        </View>

        {/* 4. Final Grade */}
        <Text style={styles.sectionNumber}>
          4. Dê uma nota de 0 a 10 para o estagiário: {evaluation.finalGrade ?? '   '}
        </Text>

        {/* Date */}
        <View style={styles.dateSection}>
          <Text>Data: {formatDateLong(evaluation.evaluationDate)}</Text>
        </View>

        {/* Signature */}
        <View style={styles.signatureLine}>
          <Text style={styles.signatureText}>________________________________________</Text>
          <Text style={styles.signatureText}>Professor Orientador</Text>
        </View>
      </Page>
    </Document>
  );
}
