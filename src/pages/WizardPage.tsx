import { useState } from 'react';
import { AppLayout } from '../AppLayout';
import { HeaderActions } from '../components';
import { WizardActions, WizardContainer } from '../wizard/WizardContainer';

export function WizardPage() {
  const [wizardActions, setWizardActions] = useState<WizardActions | null>(null);

  return (
    <AppLayout
      headerActions={
        wizardActions && (
          <HeaderActions
            hasProgress={wizardActions.hasProgress}
            onImport={wizardActions.onImport}
            onExport={wizardActions.onExport}
            onReset={wizardActions.onReset}
          />
        )
      }
    >
      <WizardContainer onActionsReady={setWizardActions} />
    </AppLayout>
  );
}
