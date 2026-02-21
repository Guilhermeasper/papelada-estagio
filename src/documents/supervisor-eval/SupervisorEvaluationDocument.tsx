import {
  EvaluationDocument,
  type IEvaluationFormData,
} from "@papelada-estagio/documents/assessments/EvaluationDocument";
import type { IInternshipData } from "@papelada-estagio/types";

interface SupervisorEvaluationDocumentProps {
  data: IInternshipData;
  evaluation: IEvaluationFormData;
}

export function SupervisorEvaluationDocument({
  data,
  evaluation,
}: SupervisorEvaluationDocumentProps) {
  return (
    <EvaluationDocument type="supervisor" data={data} evaluation={evaluation} />
  );
}
