/**
 * useWizardPersistence - Hook para persistir dados do wizard no localStorage
 * Gerencia salvamento, carregamento e limpeza do progresso do usuário
 */

import { useCallback } from 'react';
import type { IInternshipData, WizardStep } from '../domain/types';

const STORAGE_KEY = 'internship-wizard-progress';

export interface PersistedWizardState {
  data: IInternshipData;
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  savedAt: string; // ISO timestamp
}

export function useWizardPersistence() {
  /**
   * Salva o progresso atual no localStorage
   */
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

  /**
   * Carrega o progresso salvo do localStorage
   * Retorna null se não existir dados salvos
   */
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

  /**
   * Limpa todo o progresso salvo do localStorage
   */
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear wizard progress:', error);
    }
  }, []);

  /**
   * Verifica se existe progresso salvo
   */
  const hasProgress = useCallback((): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }, []);

  return {
    saveProgress,
    loadProgress,
    clearProgress,
    hasProgress,
  };
}
