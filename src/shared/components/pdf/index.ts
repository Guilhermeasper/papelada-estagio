/**
 * PDF Component Library - Index
 * Re-exports all PDF components for easy importing
 */

// Foundation
export * from './styles';
export * from './utils';

// Page
export { PDFPage } from './PDFPage';
export type { PageVariant } from './PDFPage';

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


