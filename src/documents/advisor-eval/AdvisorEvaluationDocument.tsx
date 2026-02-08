import type { IInternshipData } from "../../types";
import {
  EvaluationDocument,
  type IEvaluationFormData,
} from "../assessments/pdf/EvaluationDocument";

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
