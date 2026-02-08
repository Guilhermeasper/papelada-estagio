import { activityPlanMetadata } from "@papelada-estagio/documents/activity-plan/activity-plan.meta";
import {
  advisorEvaluationMetadata,
  supervisorEvaluationMetadata,
} from "@papelada-estagio/documents/assessments/evaluations.meta";
import { reportMetadata } from "@papelada-estagio/documents/report/report.meta";
import {
  DocumentDefinition,
  DocumentMetadata,
} from "@papelada-estagio/types/document";

export const DOCUMENT_METADATA: Record<string, DocumentMetadata> = {
  [reportMetadata.id]: reportMetadata,
  [activityPlanMetadata.id]: activityPlanMetadata,
  [advisorEvaluationMetadata.id]: advisorEvaluationMetadata,
  [supervisorEvaluationMetadata.id]: supervisorEvaluationMetadata,
};

export function getDocumentMetadata(id: string): DocumentMetadata | undefined {
  return DOCUMENT_METADATA[id];
}

export function getAllDocumentMetadata(): DocumentMetadata[] {
  return Object.values(DOCUMENT_METADATA);
}

export async function loadDocumentDefinition(
  id: string,
): Promise<DocumentDefinition | undefined> {
  switch (id) {
    case reportMetadata.id:
      return (
        await import("@papelada-estagio/documents/report/report.definition")
      ).reportDefinition;
    case activityPlanMetadata.id:
      return (
        await import("@papelada-estagio/documents/activity-plan/activity-plan.definition")
      ).activityPlanDefinition;
    case advisorEvaluationMetadata.id:
      return (
        await import("@papelada-estagio/documents/assessments/evaluations.definition")
      ).advisorEvaluationDefinition;
    case supervisorEvaluationMetadata.id:
      return (
        await import("@papelada-estagio/documents/assessments/evaluations.definition")
      ).supervisorEvaluationDefinition;
    default:
      return undefined;
  }
}
