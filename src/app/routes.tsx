import type { ComponentType } from 'react';
import { ActivityPlanPreview } from '../features/activity-plan/ActivityPlanPreview';
import { AdvisorEvaluationPreview } from '../features/advisor-eval/AdvisorEvaluationPreview';
import { ReportPreview } from '../features/report/ReportPreview';
import { SupervisorEvaluationPreview } from '../features/supervisor-eval/SupervisorEvaluationPreview';
import { WizardContainer } from '../features/wizard/WizardContainer';

export const ROUTE_MAP: Record<string, ComponentType> = {
  '#/preview': ActivityPlanPreview,
  '#/report': ReportPreview,
  '#/advisor-eval': AdvisorEvaluationPreview,
  '#/supervisor-eval': SupervisorEvaluationPreview,
};

export const DEFAULT_ROUTE_COMPONENT = WizardContainer;
