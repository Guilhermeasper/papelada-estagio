/**
 * PDFPage - Unified page wrapper component
 * Provides consistent page styling across all PDF documents
 */

import { Page } from '@react-pdf/renderer';
import type { ReactNode } from 'react';
import { pageStyles } from './styles';

export type PageVariant = 'default' | 'evaluation' | 'cover' | 'activityPlan' | 'report';

interface PDFPageProps {
  variant?: PageVariant;
  children: ReactNode;
  wrap?: boolean;
}

/**
 * Wraps @react-pdf/renderer's Page component with predefined styles.
 */
export function PDFPage({ variant = 'default', children, wrap }: PDFPageProps) {
  const style = variant === 'report' ? pageStyles.cover : pageStyles[variant];
  
  return (
    <Page size="A4" style={style} wrap={wrap}>
      {children}
    </Page>
  );
}
