import { activityPlanDefinition } from "@papelada-estagio/documents/activity-plan/activity-plan.definition";
import {
  advisorEvaluationDefinition,
  supervisorEvaluationDefinition,
} from "@papelada-estagio/documents/assessments/evaluations.definition";
import { reportDefinition } from "@papelada-estagio/documents/report/report.definition";
import { DocumentDefinition } from "@papelada-estagio/types/document";
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
