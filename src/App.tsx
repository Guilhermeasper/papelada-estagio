import { useEffect, useState } from 'react';
import { ActivityPlanPreview } from './features/activity-plan/ActivityPlanPreview';
import { AdvisorEvaluationPreview } from './features/advisor-eval/AdvisorEvaluationPreview';
import { ReportPreview } from './features/report/ReportPreview';
import { SupervisorEvaluationPreview } from './features/supervisor-eval/SupervisorEvaluationPreview';
import { ErrorBoundary } from './shared/components';
import { WizardContainer } from './wizard/WizardContainer';

function App() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple hash-based routing for preview
  if (route === '#/preview') {
    return <ActivityPlanPreview />;
  }

  if (route === '#/report') {
    return <ReportPreview />;
  }

  if (route === '#/advisor-eval') {
    return <AdvisorEvaluationPreview />;
  }

  if (route === '#/supervisor-eval') {
    return <SupervisorEvaluationPreview />;
  }

  return (
    <ErrorBoundary>
      <WizardContainer />
    </ErrorBoundary>
  );
}

export default App;
