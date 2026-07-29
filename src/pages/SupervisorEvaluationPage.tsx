import { PDFPageViewer } from "@papelada-estagio/components/pdf";
import { SupervisorEvaluationDocument } from "@papelada-estagio/documents/supervisor-eval/SupervisorEvaluationDocument";
import { mockInternshipData } from "@papelada-estagio/mocks/mockInternshipData";
import { mockSupervisorEvaluationData } from "@papelada-estagio/mocks/mockSupervisorEvaluationData";

export function SupervisorEvaluationPage() {
  return (
    <PDFPageViewer>
      <SupervisorEvaluationDocument
        data={mockInternshipData}
        evaluation={mockSupervisorEvaluationData}
      />
    </PDFPageViewer>
  );
}
