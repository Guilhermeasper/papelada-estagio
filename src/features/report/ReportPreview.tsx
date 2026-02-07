

import { PDFViewer } from '@react-pdf/renderer';
import { ReportDocument } from './ReportDocument';
import { mockReportData } from './mockData';

export function ReportPreview() {
  return (
    <PDFViewer style={{ width: '100vw', height: '100vh', border: 'none' }}>
      <ReportDocument data={mockReportData} />
    </PDFViewer>
  );
}
