import { lazy, type ComponentType } from "react";

import { NotFoundPage } from "./pages/NotFoundPage";

export const ROUTE_MAP: Record<string, ComponentType> = {
  "": lazy(() =>
    import("./pages/WizardPage").then((m) => ({ default: m.WizardPage })),
  ),
  "#/": lazy(() =>
    import("./pages/WizardPage").then((m) => ({ default: m.WizardPage })),
  ),
  "#/preview": lazy(() =>
    import("./pages/ActivityPlanPage").then((m) => ({
      default: m.ActivityPlanPage,
    })),
  ),
  "#/report": lazy(() =>
    import("./pages/ReportPage").then((m) => ({ default: m.ReportPage })),
  ),
  "#/advisor-eval": lazy(() =>
    import("./pages/AdvisorEvaluationPage").then((m) => ({
      default: m.AdvisorEvaluationPage,
    })),
  ),
  "#/supervisor-eval": lazy(() =>
    import("./pages/SupervisorEvaluationPage").then((m) => ({
      default: m.SupervisorEvaluationPage,
    })),
  ),
  "#/debug": lazy(() =>
    import("./pages/DebugPage").then((m) => ({ default: m.DebugPage })),
  ),
};

export const DEFAULT_ROUTE_COMPONENT = NotFoundPage;
