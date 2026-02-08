import { activityPlanDefinition } from "../documents/activity-plan/activity-plan.definition";
import {
  advisorEvaluationDefinition,
  supervisorEvaluationDefinition,
} from "../documents/assessments/evaluations.definition";
import { reportDefinition } from "../documents/report/report.definition";
import { DocumentDefinition } from "../types/document";
// import { DocumentType } from '../shared/domain/types'; // We might want to use DocumentType as key if it exists, or infer it.

export const DOCUMENT_REGISTRY: Record<string, DocumentDefinition> = {
  [reportDefinition.id]: reportDefinition,
  [activityPlanDefinition.id]: activityPlanDefinition,
  [advisorEvaluationDefinition.id]: advisorEvaluationDefinition,
  [supervisorEvaluationDefinition.id]: supervisorEvaluationDefinition,
};

export function getDocumentDefinition(
  id: string,
): DocumentDefinition | undefined {
  return DOCUMENT_REGISTRY[id];
}

export function getAllDocumentDefinitions(): DocumentDefinition[] {
  return Object.values(DOCUMENT_REGISTRY);
}
