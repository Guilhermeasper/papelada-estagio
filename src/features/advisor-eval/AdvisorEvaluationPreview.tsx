

import { PDFViewer } from '@react-pdf/renderer';
import { AdvisorEvaluationDocument } from '../evaluations/pdf';
import { mockReportData } from '../report/mockData';
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
