import { SupervisorEvaluationDocument } from "@papelada-estagio/documents/supervisor-eval/SupervisorEvaluationDocument";
import { mockInternshipData } from "@papelada-estagio/mocks/mockInternshipData";
import { mockSupervisorEvaluationData } from "@papelada-estagio/mocks/mockSupervisorEvaluationData";
import { PDFViewer } from "@react-pdf/renderer";

export function SupervisorEvaluationPage() {
  return (
    <PDFViewer style={{ width: "100vw", height: "100vh" }}>
      <SupervisorEvaluationDocument
        data={mockInternshipData}
        evaluation={mockSupervisorEvaluationData}
      />
    </PDFViewer>
  );
}
