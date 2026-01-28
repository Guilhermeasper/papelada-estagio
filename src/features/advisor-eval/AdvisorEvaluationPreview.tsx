/**
 * AdvisorEvaluationPreview - Preview component for testing
 */

import { PDFViewer } from '@react-pdf/renderer';
import { mockReportData } from '../report/mockData';
import { AdvisorEvaluationDocument } from './AdvisorEvaluationDocument';
import { mockAdvisorEvaluationData } from './mockData';

export function AdvisorEvaluationPreview() {
  return (
    <PDFViewer style={{ width: '100vw', height: '100vh' }}>
      <AdvisorEvaluationDocument 
        data={mockReportData} 
        evaluation={mockAdvisorEvaluationData} 
      />
    </PDFViewer>
  );
}
