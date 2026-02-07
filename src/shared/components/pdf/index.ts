/**
 * PDF Component Library - Index
 * Re-exports all PDF components for easy importing
 */

// Foundation
export * from './styles';
export * from './utils';

// Headers
export { PDFLogoHeader } from './PDFLogoHeader';
export { PDFTextHeader } from './PDFTextHeader';

// Tables
export { PDFCommentsBox } from './PDFCommentsBox';
export { PDFKeyValueTable } from './PDFKeyValueTable';
export type { KeyValueItem } from './PDFKeyValueTable';
export { PDFTable } from './PDFTable';
export type { ColumnConfig } from './PDFTable';

// Text & Layout
export { PDFBulletList } from './PDFBulletList';
export { PDFFieldRow } from './PDFFieldRow';
export { PDFNumberedList } from './PDFNumberedList';
export { PDFParagraph } from './PDFParagraph';
export { PDFSection } from './PDFSection';

// Signatures
export { PDFSignatureBlock } from './PDFSignatureBlock';
export type { SignatureConfig } from './PDFSignatureBlock';
export { PDFSignatureLine } from './PDFSignatureLine';

// Evaluation-specific
export { PDFGradeField } from './PDFGradeField';
export { PDFRatingRow } from './PDFRatingRow';

// Unified Evaluation Document
export {
    AdvisorEvaluationDocument, EvaluationDocument,
    SupervisorEvaluationDocument
} from './EvaluationDocument';
export type { EvaluationType, IEvaluationData } from './EvaluationDocument';

