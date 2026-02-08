
import type { IInternshipData } from '../../types/types';
import { EvaluationDocument, type IEvaluationFormData } from '../evaluations/pdf/EvaluationDocument';

interface AdvisorEvaluationDocumentProps {
  data: IInternshipData;
  evaluation: IEvaluationFormData;
}

export function AdvisorEvaluationDocument({ data, evaluation }: AdvisorEvaluationDocumentProps) {
  return <EvaluationDocument type="advisor" data={data} evaluation={evaluation} />;
}
