import type { ComponentType } from 'react';
import { ActivityPlanPreview } from '../features/activity-plan/ActivityPlanPreview';
import { AdvisorEvaluationPreview } from '../features/advisor-eval/AdvisorEvaluationPreview';
import { ReportPreview } from '../features/report/ReportPreview';
import { SupervisorEvaluationPreview } from '../features/supervisor-eval/SupervisorEvaluationPreview';
import { WizardContainer } from '../features/wizard/WizardContainer';

import { DebugPage } from './pages/DebugPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const ROUTE_MAP: Record<string, ComponentType> = {
  '': WizardContainer,
  '#/': WizardContainer,
  '#/preview': ActivityPlanPreview,
  '#/report': ReportPreview,
  '#/advisor-eval': AdvisorEvaluationPreview,
  '#/supervisor-eval': SupervisorEvaluationPreview,
  '#/debug': DebugPage,
};

export const DEFAULT_ROUTE_COMPONENT = NotFoundPage;
