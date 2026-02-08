import {
  EvaluationDocument,
  type IEvaluationFormData,
} from "../../documents/assessments/pdf/EvaluationDocument";
import type { IInternshipData } from "../../types";

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
