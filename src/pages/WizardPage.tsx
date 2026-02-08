import { AppLayout } from "../AppLayout";
import {
  HeaderActions,
  ImportConfirmDialog,
  ResetConfirmDialog,
} from "../components";
import { useWizardData } from "../hooks";
import { WizardContainer } from "../wizard/WizardContainer";

export function WizardPage() {
  const { state, actions, dialogs } = useWizardData();

  return (
    <AppLayout
      headerActions={
        <HeaderActions
          hasProgress={state.hasProgress}
          onImport={actions.triggerImport}
          onExport={actions.exportData}
          onReset={() => dialogs.setShowResetDialog(true)}
        />
      }
    >
      <ResetConfirmDialog
        isOpen={dialogs.showResetDialog}
        onConfirm={actions.reset}
        onCancel={() => dialogs.setShowResetDialog(false)}
      />

      <ImportConfirmDialog
        isOpen={dialogs.importDialog.isOpen}
        previewData={dialogs.importDialog.previewData}
        error={dialogs.importDialog.error}
        onConfirm={dialogs.confirmImport}
        onCancel={dialogs.cancelImport}
      />

      <input
        type="file"
        ref={dialogs.fileInputRef}
        accept=".json"
        onChange={dialogs.handleFileSelect}
        className="hidden"
      />

      <WizardContainer state={state} actions={actions} />
    </AppLayout>
  );
}
