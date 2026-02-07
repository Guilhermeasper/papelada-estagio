

import { useCallback } from 'react';
import { persistedStateSchema } from '../../features/wizard/schemas/validationSchemas';
import type { IInternshipData, WizardStep } from '../domain/types';

const STORAGE_KEY = 'internship-wizard-progress';

export interface PersistedWizardState {
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

  const saveProgress = useCallback((
    data: IInternshipData,
    currentStep: WizardStep,
    completedSteps: WizardStep[]
  ) => {
    const state: PersistedWizardState = {
      data,
      currentStep,
      completedSteps,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save wizard progress:', error);
    }
  }, []);


  const loadProgress = useCallback((): PersistedWizardState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      return JSON.parse(saved) as PersistedWizardState;
    } catch (error) {
      console.error('Failed to load wizard progress:', error);
      return null;
    }
  }, []);


  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear wizard progress:', error);
    }
  }, []);


  const hasProgress = useCallback((): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }, []);


  const exportProgress = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      console.warn('No progress to export');
      return;
    }

    try {
      const blob = new Blob([saved], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      

      const date = new Date().toISOString().split('T')[0];
      link.download = `internship-progress-${date}.json`;
      link.href = url;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export progress:', error);
    }
  }, []);


  const importProgress = useCallback(async (file: File): Promise<ImportResult> => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      

      const result = persistedStateSchema.safeParse(parsed);
      
      if (!result.success) {
        const errorMessage = result.error.issues
          .map(issue => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        return { success: false, error: `Arquivo inválido: ${errorMessage}` };
      }
      
      return { 
        success: true, 
        state: result.data as PersistedWizardState 
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        return { success: false, error: 'Arquivo não é um JSON válido' };
      }
      return { success: false, error: 'Erro ao ler o arquivo' };
    }
  }, []);

  return {
    saveProgress,
    loadProgress,
    clearProgress,
    hasProgress,
    exportProgress,
    importProgress,
  };
}

