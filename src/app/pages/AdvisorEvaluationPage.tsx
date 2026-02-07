
import { PDFViewer } from '@react-pdf/renderer';
import { AdvisorEvaluationDocument } from '../../features/advisor-eval/AdvisorEvaluationDocument';
import { mockAdvisorEvaluationData } from '../../shared/mocks/mockAdvisorEvaluationData';
import { mockInternshipData } from '../../shared/mocks/mockInternshipData';

export function AdvisorEvaluationPage() {
  return (
    <PDFViewer style={{ width: '100vw', height: '100vh' }}>
      <AdvisorEvaluationDocument 
        data={mockInternshipData} 
        evaluation={mockAdvisorEvaluationData} 
      />
    </PDFViewer>
  );
}
