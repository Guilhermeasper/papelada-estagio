import { ReportDocument } from "@papelada-estagio/documents/report/ReportDocument";
import { mockInternshipData } from "@papelada-estagio/mocks/mockInternshipData";
import { PDFViewer } from "@react-pdf/renderer";

export function ReportPage() {
  return (
    <PDFViewer style={{ width: "100vw", height: "100vh", border: "none" }}>
      <ReportDocument data={mockInternshipData} />
    </PDFViewer>
  );
}
