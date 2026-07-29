import { PDFPageViewer } from "@papelada-estagio/components/pdf";
import { ReportDocument } from "@papelada-estagio/documents/report/ReportDocument";
import { mockInternshipData } from "@papelada-estagio/mocks/mockInternshipData";

export function ReportPage() {
  return (
    <PDFPageViewer>
      <ReportDocument data={mockInternshipData} />
    </PDFPageViewer>
  );
}
