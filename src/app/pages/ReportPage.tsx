
import { PDFViewer } from '@react-pdf/renderer';
import { ReportDocument } from '../../features/report/ReportDocument';
import { mockInternshipData } from '../../mocks/mockInternshipData';

export function ReportPage() {
  return (
    <PDFViewer style={{ width: '100vw', height: '100vh', border: 'none' }}>
      <ReportDocument data={mockInternshipData} />
    </PDFViewer>
  );
}
