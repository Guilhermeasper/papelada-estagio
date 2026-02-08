import { AdvisorEvaluationDocument } from "@papelada-estagio/documents/advisor-eval/AdvisorEvaluationDocument";
import { mockAdvisorEvaluationData } from "@papelada-estagio/mocks/mockAdvisorEvaluationData";
import { mockInternshipData } from "@papelada-estagio/mocks/mockInternshipData";
import { PDFViewer } from "@react-pdf/renderer";

export function AdvisorEvaluationPage() {
  return (
    <PDFViewer style={{ width: "100vw", height: "100vh" }}>
      <AdvisorEvaluationDocument
        data={mockInternshipData}
        evaluation={mockAdvisorEvaluationData}
      />
    </PDFViewer>
  );
}
