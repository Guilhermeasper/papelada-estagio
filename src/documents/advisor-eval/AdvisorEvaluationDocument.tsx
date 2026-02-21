import {
  EvaluationDocument,
  type IEvaluationFormData,
} from "@papelada-estagio/documents/assessments/EvaluationDocument";
import type { IInternshipData } from "@papelada-estagio/types";

interface AdvisorEvaluationDocumentProps {
  data: IInternshipData;
  evaluation: IEvaluationFormData;
}

export function AdvisorEvaluationDocument({
  data,
  evaluation,
}: AdvisorEvaluationDocumentProps) {
  return (
    <EvaluationDocument type="advisor" data={data} evaluation={evaluation} />
  );
}
