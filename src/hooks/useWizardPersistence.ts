import type { IInternshipData, WizardStep } from "@papelada-estagio/types";
import {
  CURRENT_DATA_VERSION,
  migrateData,
} from "@papelada-estagio/utils/migrations";
import { persistedStateSchema } from "@papelada-estagio/wizard/schemas/validationSchemas";
import { useCallback } from "react";

const STORAGE_KEY = "internship-wizard-progress";

export interface PersistedWizardState {
  version: number;
  data: IInternshipData;
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  savedAt: string;
}

export interface ImportResult {
  success: boolean;
  state?: PersistedWizardState;
  error?: string;
}

export function useWizardPersistence() {
  const saveProgress = useCallback(
    (
      data: IInternshipData,
      currentStep: WizardStep,
      completedSteps: WizardStep[],
    ) => {
      const state: PersistedWizardState = {
        version: CURRENT_DATA_VERSION,
        data,
        currentStep,
        completedSteps,
        savedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save wizard progress:", error);
      }
    },
    [],
  );

  const loadProgress = useCallback((): PersistedWizardState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const parsed = JSON.parse(saved);

      // Handle legacy data (without version)
      // If version is missing, assume 0 or handle as legacy
      // Ideally, we should check if 'version' key exists.
      const version = typeof parsed.version === "number" ? parsed.version : 0;

      let migratedData = parsed.data;
      if (version < CURRENT_DATA_VERSION) {
        try {
          migratedData = migrateData(parsed.data, version);
        } catch (error) {
          console.error("Migration failed:", error);
          // If migration fails, we might want to notify user or return null to reset
          // For now, let's catch and maybe return null so app doesn't crash,
          // or re-throw if we want UI to show "Reset Needed"
          return null;
        }
      }

      return {
        ...parsed,
        version: CURRENT_DATA_VERSION,
        data: migratedData,
      } as PersistedWizardState;
    } catch (error) {
      console.error("Failed to load wizard progress:", error);
      return null;
    }
  }, []);

  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear wizard progress:", error);
    }
  }, []);

  const hasProgress = useCallback((): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }, []);

  const exportProgress = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      console.warn("No progress to export");
      return;
    }

    try {
      // We read from storage, which should already be JSON stringified.
      // However, we might want to ensure it has the version if it was saved before this update?
      // Since we updated saveProgress, new saves have version.
      // Old saves might not.
      // Ideally, we load, migrate, then export.

      const loaded = loadProgress(); // This runs migration
      if (!loaded) return;

      const exportPayload = JSON.stringify(loaded, null, 2);

      const blob = new Blob([exportPayload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const date = new Date().toISOString().split("T")[0];
      link.download = `internship-progress-${date}.json`;
      link.href = url;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export progress:", error);
    }
  }, [loadProgress]);

  const importProgress = useCallback(
    async (file: File): Promise<ImportResult> => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);

        // Check version and migrate if needed
        const version = typeof parsed.version === "number" ? parsed.version : 0;

        if (version < CURRENT_DATA_VERSION) {
          try {
            parsed.data = migrateData(parsed.data, version);
            parsed.version = CURRENT_DATA_VERSION;
          } catch (e) {
            return {
              success: false,
              error: "Falha ao migrar dados de versão antiga.",
            };
          }
        }

        const result = persistedStateSchema.safeParse(parsed);

        if (!result.success) {
          const errorMessage = result.error.issues
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
            .join(", ");
          return { success: false, error: `Arquivo inválido: ${errorMessage}` };
        }

        return {
          success: true,
          state: result.data as PersistedWizardState,
        };
      } catch (error) {
        if (error instanceof SyntaxError) {
          return { success: false, error: "Arquivo não é um JSON válido" };
        }
        return { success: false, error: "Erro ao ler o arquivo" };
      }
    },
    [],
  );

  return {
    saveProgress,
    loadProgress,
    clearProgress,
    hasProgress,
    exportProgress,
    importProgress,
  };
}
