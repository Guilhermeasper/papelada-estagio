
import type { IInternshipData } from '../../types/types';
import { EvaluationDocument, type IEvaluationFormData } from '../evaluations/pdf/EvaluationDocument';

interface SupervisorEvaluationDocumentProps {
  data: IInternshipData;
  evaluation: IEvaluationFormData;
}

export function SupervisorEvaluationDocument({ data, evaluation }: SupervisorEvaluationDocumentProps) {
  return <EvaluationDocument type="supervisor" data={data} evaluation={evaluation} />;
}
