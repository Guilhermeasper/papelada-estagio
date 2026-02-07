/**
 * EvaluationDocument - Unified Supervisor/Advisor Evaluation PDF Component
 * Renders evaluation forms using @react-pdf/renderer
 */

import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { PDF_CONTENT } from '../../constants/pdf-content';
import type { IInternshipData } from '../../domain/types';
import { PDFCommentsBox } from './PDFCommentsBox';
import { PDFGradeField } from './PDFGradeField';
import { PDFKeyValueTable, type KeyValueItem } from './PDFKeyValueTable';
import { PDFRatingRow } from './PDFRatingRow';
import { PDFSection } from './PDFSection';
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
// Local Styles
// ============================================
const styles = StyleSheet.create({
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
  const { evaluationDocument } = PDF_CONTENT;
  const config = evaluationDocument[type];
  const { student, company, general } = data;

  const getPersonName = () => {
    return type === 'supervisor' 
      ? data.supervision.supervisorName 
      : data.supervision.advisorName;
  }

  // Build identification table items
  const idItems: KeyValueItem[] = [
    { label: 'Nome do aluno:', value: student.fullName },
    { label: 'Curso do Aluno:', value: student.course },
    { label: 'Nome da empresa:', value: company.companyName },
    { label: 'Data de início do estágio:', value: formatDatePtBr(general.startDate) },
    { label: 'Data de término do estágio:', value: formatDatePtBr(general.endDate) },
    { label: config.lastRowLabel, value: getPersonName() },
  ];

  return (
    <Document>
      <Page size="A4" style={pageStyles.evaluation}>
        {/* Header */}
        <PDFTextHeader
          subtitle={evaluationDocument.shared.subtitle}
          title={config.title}
        />

        {/* 1. Identificação */}
        <PDFSection 
          number="1" 
          title={evaluationDocument.shared.sections.identification}
          titleStyle={{ fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 10 }}
        >
          <PDFKeyValueTable items={idItems} />
        </PDFSection>

        {/* 2. Avaliação */}
        <PDFSection 
          number="2" 
          title={evaluationDocument.shared.sections.evaluation}
          titleStyle={{ fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 10 }}
        >
          <Text style={styles.evalIntro}>
            {evaluationDocument.shared.intro}
          </Text>

          {evaluationDocument.shared.criteria.map((criterion) => (
            <PDFRatingRow
              key={criterion.key}
              label={criterion.label}
              selected={evaluation[criterion.key as keyof IEvaluationData] as Rating | undefined}
            />
          ))}
        </PDFSection>

        {/* 3. Comentários */}
        <PDFSection 
          number="3" 
          title={evaluationDocument.shared.comments.title}
          titleStyle={{ fontSize: 11, fontFamily: 'Helvetica-Bold', marginBottom: 10 }}
          style={styles.commentsSection}
        >
          <PDFCommentsBox text={evaluation.detailedComments} lines={10} />
        </PDFSection>

        {/* 4. Final Grade */}
        <PDFGradeField sectionNumber={4} grade={evaluation.finalGrade} />

        {/* Date */}
        <View style={styles.dateSection}>
          <Text>{evaluationDocument.shared.datePrefix} {formatDateLong(general.endDate)}</Text>
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
