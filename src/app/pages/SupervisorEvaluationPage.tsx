
import { PDFViewer } from '@react-pdf/renderer';
import { SupervisorEvaluationDocument } from '../../features/supervisor-eval/SupervisorEvaluationDocument';
import { mockInternshipData } from '../../shared/mocks/mockInternshipData';
import { mockSupervisorEvaluationData } from '../../shared/mocks/mockSupervisorEvaluationData';

export function SupervisorEvaluationPage() {
  return (
    <PDFViewer style={{ width: '100vw', height: '100vh' }}>
      <SupervisorEvaluationDocument 
        data={mockInternshipData} 
        evaluation={mockSupervisorEvaluationData} 
      />
    </PDFViewer>
  );
}
