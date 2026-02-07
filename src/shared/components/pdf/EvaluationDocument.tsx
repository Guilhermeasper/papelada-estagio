/**
 * EvaluationDocument - Unified Supervisor/Advisor Evaluation PDF Component
 * Renders evaluation forms using @react-pdf/renderer
 */

import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { IInternshipData } from '../../domain/types';
import { PDFCommentsBox } from './PDFCommentsBox';
import { PDFGradeField } from './PDFGradeField';
import { PDFKeyValueTable, type KeyValueItem } from './PDFKeyValueTable';
import { PDFRatingRow } from './PDFRatingRow';
import { PDFSignatureLine } from './PDFSignatureLine';
import { PDFTextHeader } from './PDFTextHeader';
import { pageStyles } from './styles';
import { formatDateLong, formatDatePtBr, type Rating } from './utils';

// ============================================
// Evaluation Data Interface
// ============================================
export interface IEvaluationData {
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

// ============================================
// Evaluation Type
// ============================================
export type EvaluationType = 'supervisor' | 'advisor';

// ============================================
// Configuration per type
// ============================================
const CONFIG = {
  supervisor: {
    headerTitle: 'Avaliação do Supervisor do Estágio',
    lastRowLabel: 'Nome do supervisor:',
    signatureLabel: 'Supervisor do Estágio',
    getPersonName: (data: IInternshipData) => data.supervision.supervisorName,
  },
  advisor: {
    headerTitle: 'Avaliação do Professor Orientador',
    lastRowLabel: 'Nome do Professor Orientador:',
    signatureLabel: 'Professor Orientador',
    getPersonName: (data: IInternshipData) => data.supervision.advisorName,
  },
};

// ============================================
// Evaluation Criteria (shared)
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
// Local Styles
// ============================================
const styles = StyleSheet.create({
  sectionNumber: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
  },
  evalIntro: {
    fontSize: 11,
    marginBottom: 15,
  },
  commentsSection: {
    marginTop: 20,
  },
  dateSection: {
    marginTop: 40,
    textAlign: 'center',
  },
});

// ============================================
// Props Interface
// ============================================
interface EvaluationDocumentProps {
  type: EvaluationType;
  data: IInternshipData;
  evaluation: IEvaluationData;
}

// ============================================
// Main Component
// ============================================
export function EvaluationDocument({ type, data, evaluation }: EvaluationDocumentProps) {
  const config = CONFIG[type];
  const { student, company, general } = data;

  // Build identification table items
  const idItems: KeyValueItem[] = [
    { label: 'Nome do aluno:', value: student.fullName },
    { label: 'Curso do Aluno:', value: student.course },
    { label: 'Nome da empresa:', value: company.companyName },
    { label: 'Data de início do estágio:', value: formatDatePtBr(general.startDate) },
    { label: 'Data de término do estágio:', value: formatDatePtBr(general.endDate) },
    { label: config.lastRowLabel, value: config.getPersonName(data) },
  ];

  return (
    <Document>
      <Page size="A4" style={pageStyles.evaluation}>
        {/* Header */}
        <PDFTextHeader
          subtitle="Estágio Supervisionado"
          title={config.headerTitle}
        />

        {/* 1. Identificação */}
        <Text style={styles.sectionNumber}>1. Identificação</Text>
        <PDFKeyValueTable items={idItems} />

        {/* 2. Avaliação */}
        <Text style={styles.sectionNumber}>2. Avaliação</Text>
        <Text style={styles.evalIntro}>
          Como você avalia o desempenho do estagiário em cada um dos aspectos a seguir:
        </Text>

        {evaluationCriteria.map((criterion) => (
          <PDFRatingRow
            key={criterion.key}
            label={criterion.label}
            selected={evaluation[criterion.key as keyof IEvaluationData] as Rating | undefined}
          />
        ))}

        {/* 3. Comentários */}
        <Text style={[styles.sectionNumber, styles.commentsSection]}>
          3. Caso deseje, utilize o espaço abaixo para uma avaliação mais detalhada sobre o estagiário.
        </Text>
        <PDFCommentsBox text={evaluation.detailedComments} lines={10} />

        {/* 4. Final Grade */}
        <PDFGradeField sectionNumber={4} grade={evaluation.finalGrade} />

        {/* Date */}
        <View style={styles.dateSection}>
          <Text>Data: {formatDateLong(general.endDate)}</Text>
        </View>

        {/* Signature */}
        <PDFSignatureLine label={config.signatureLabel} />
      </Page>
    </Document>
  );
}

// ============================================
// Convenience exports for backwards compatibility
// ============================================
export function SupervisorEvaluationDocument(props: Omit<EvaluationDocumentProps, 'type'>) {
  return <EvaluationDocument type="supervisor" {...props} />;
}

export function AdvisorEvaluationDocument(props: Omit<EvaluationDocumentProps, 'type'>) {
  return <EvaluationDocument type="advisor" {...props} />;
}
