import { PersistedWizardState } from "../hooks";
import { Button } from "./Button";

interface ResetDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ResetConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
}: ResetDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative bg-surface-elevated dark:bg-surface-elevated-dark rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        <h2 className="text-lg md:text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">
          Apagar todos os dados?
        </h2>

        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mb-6">
          Esta ação irá remover todos os dados salvos e reiniciar o formulário.
          Esta ação não pode ser desfeita.
        </p>

        <div className="flex flex-col gap-3">
          <Button onClick={onConfirm} variant="danger" className="w-full">
            Apagar dados e reiniciar
          </Button>

          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ImportDialogProps {
  isOpen: boolean;
  previewData: PersistedWizardState | null;
  onConfirm: () => void;
  onCancel: () => void;
  error?: string;
}

export function ImportConfirmDialog({
  isOpen,
  previewData,
  onConfirm,
  onCancel,
  error,
}: ImportDialogProps) {
  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString("pt-BR");
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative bg-surface-elevated dark:bg-surface-elevated-dark rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        {error ? (
          <>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-3">
              Erro ao importar
            </h2>
            <p className="text-text-secondary dark:text-text-secondary-dark mb-6">
              {error}
            </p>
            <Button onClick={onCancel} variant="secondary" className="w-full">
              Fechar
            </Button>
          </>
        ) : previewData ? (
          <>
            <h2 className="text-lg md:text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">
              Importar progresso?
            </h2>

            <div className="bg-surface dark:bg-surface-dark rounded-lg p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-text-secondary-dark">
                  Aluno:
                </span>
                <span className="text-text-primary dark:text-text-primary-dark font-medium">
                  {previewData.data.student.fullName || "(não preenchido)"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-text-secondary-dark">
                  Passo atual:
                </span>
                <span className="text-text-primary dark:text-text-primary-dark font-medium">
                  {previewData.currentStep} de 8
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-text-secondary-dark">
                  Salvo em:
                </span>
                <span className="text-text-primary dark:text-text-primary-dark font-medium">
                  {formatDate(previewData.savedAt)}
                </span>
              </div>
            </div>

            <p className="text-text-secondary dark:text-text-secondary-dark mb-6 text-sm">
              Isso irá substituir todos os dados atuais. Deseja continuar?
            </p>

            <div className="flex flex-col gap-3">
              <Button onClick={onConfirm} className="w-full">
                Importar e substituir
              </Button>

              <Button
                onClick={onCancel}
                variant="ghost"
                size="sm"
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
