import { PDFPageViewer } from "@papelada-estagio/components/pdf";
import { AdvisorEvaluationDocument } from "@papelada-estagio/documents/advisor-eval/AdvisorEvaluationDocument";
import { mockAdvisorEvaluationData } from "@papelada-estagio/mocks/mockAdvisorEvaluationData";
import { mockInternshipData } from "@papelada-estagio/mocks/mockInternshipData";

export function AdvisorEvaluationPage() {
  return (
    <PDFPageViewer>
      <AdvisorEvaluationDocument
        data={mockInternshipData}
        evaluation={mockAdvisorEvaluationData}
      />
    </PDFPageViewer>
  );
}
