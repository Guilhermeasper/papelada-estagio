/**
 * ActivityPlanPreview - PDF Preview Component
 * Renders the ActivityPlanDocument in browser for testing
 */

import { PDFViewer } from '@react-pdf/renderer';
import { ActivityPlanDocument } from './ActivityPlanDocument';
import { mockInternshipData } from './mockData';

export function ActivityPlanPreview() {
  return (
    <PDFViewer style={{ width: '100vw', height: '100vh', border: 'none' }}>
      <ActivityPlanDocument data={mockInternshipData} />
    </PDFViewer>
  );
}
