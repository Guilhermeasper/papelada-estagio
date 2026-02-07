/**
 * SupervisorEvaluationPreview - Preview component for testing
 */

import { PDFViewer } from '@react-pdf/renderer';
import { SupervisorEvaluationDocument } from '../../shared/components/pdf';
import { mockReportData } from '../report/mockData';
import { mockSupervisorEvaluationData } from './mockData';

export function SupervisorEvaluationPreview() {
  return (
    <PDFViewer style={{ width: '100vw', height: '100vh' }}>
      <SupervisorEvaluationDocument 
        data={mockReportData} 
        evaluation={mockSupervisorEvaluationData} 
      />
    </PDFViewer>
  );
}
