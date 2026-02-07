/**
 * Initialize document registry with all document components
 * This file imports from features and registers them with core
 */

import { registerDocument } from '../core/document-generation';
import { ActivityPlanDocument } from '../features/activity-plan/ActivityPlanDocument';
import {
    AdvisorEvaluationDocument,
    SupervisorEvaluationDocument,
    type IEvaluationFormData
} from '../features/evaluations/pdf';
import { ReportDocument } from '../features/report/ReportDocument';
import type { IInternshipData } from '../shared/domain/types';

function getDefaultEvaluationData(): IEvaluationFormData {
  return {
    communication: undefined,
    attendance: undefined,
    cooperation: undefined,
    independence: undefined,
    knowledgeLevel: undefined,
    overallPerformance: undefined,
    detailedComments: undefined,
    finalGrade: undefined,
    evaluationDate: undefined,
  };
}

// Wrapper components that provide default evaluation data
function AdvisorEvalWrapper({ data }: { data: IInternshipData }) {
  return <AdvisorEvaluationDocument data={data} evaluation={getDefaultEvaluationData()} />;
}

function SupervisorEvalWrapper({ data }: { data: IInternshipData }) {
  return <SupervisorEvaluationDocument data={data} evaluation={getDefaultEvaluationData()} />;
}

export function initializeDocumentRegistry(): void {
  // Register standard documents
  registerDocument('report', ReportDocument);
  registerDocument('activity-plan', ActivityPlanDocument);

  // Register evaluation documents with wrappers that provide default data
  registerDocument('advisor-eval', AdvisorEvalWrapper);
  registerDocument('supervisor-eval', SupervisorEvalWrapper);
}
