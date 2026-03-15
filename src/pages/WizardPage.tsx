import { AppLayout } from "@papelada-estagio/AppLayout";
import {
  HeaderActions,
  ImportConfirmDialog,
  ResetConfirmDialog,
} from "@papelada-estagio/components";
import { useWizardData } from "@papelada-estagio/hooks";
import { WizardContainer } from "@papelada-estagio/wizard/WizardContainer";

export function WizardPage() {
  const { state, actions, dialogs } = useWizardData();

  return (
    <AppLayout
      headerActions={
        <HeaderActions
          hasProgress={state.hasProgress}
          onImport={actions.triggerImport}
          onExport={actions.exportData}
          onReset={() => {
            dialogs.setShowResetDialog(true);
          }}
        />
      }
    >
      <ResetConfirmDialog
        isOpen={dialogs.showResetDialog}
        onConfirm={actions.reset}
        onCancel={() => {
          dialogs.setShowResetDialog(false);
        }}
      />

      <ImportConfirmDialog
        isOpen={dialogs.importDialog.isOpen}
        previewData={dialogs.importDialog.previewData}
        error={dialogs.importDialog.error}
        onConfirm={dialogs.confirmImport}
        onCancel={dialogs.cancelImport}
      />

      <WizardContainer state={state} actions={actions} />
    </AppLayout>
  );
}
