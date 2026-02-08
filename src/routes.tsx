import type { ComponentType } from 'react';
import { ActivityPlanPage } from './pages/ActivityPlanPage';
import { AdvisorEvaluationPage } from './pages/AdvisorEvaluationPage';
import { ReportPage } from './pages/ReportPage';
import { SupervisorEvaluationPage } from './pages/SupervisorEvaluationPage';
import { WizardPage } from './pages/WizardPage';

import { DebugPage } from './pages/DebugPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const ROUTE_MAP: Record<string, ComponentType> = {
  '': WizardPage,
  '#/': WizardPage,
  '#/preview': ActivityPlanPage,
  '#/report': ReportPage,
  '#/advisor-eval': AdvisorEvaluationPage,
  '#/supervisor-eval': SupervisorEvaluationPage,
  '#/debug': DebugPage,
};

export const DEFAULT_ROUTE_COMPONENT = NotFoundPage;
