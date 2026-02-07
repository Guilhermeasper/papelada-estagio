/**
 * WizardContainer - Container principal do wizard
 * Gerencia estado e navegação entre passos
 * Refactored to use registry pattern and lazy loading
 * With localStorage persistence for progress saving
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ThemeToggle } from '../shared/components';
import {
  ICompanyData,
  IInternshipContent,
  IInternshipData,
  IInternshipGeneral,
  IStudentData,
  ISupervisionData,
  WizardStep
} from '../shared/domain/types';
import { PersistedWizardState, useWizardPersistence } from '../shared/hooks';
import { MobileStepPopover } from './MobileStepPopover';
import { StepIndicator } from './StepIndicator';
import { STEPS, TOTAL_STEPS } from './stepConfig';
import { STEP_REGISTRY } from './stepRegistry';

// Factory function for initial state
function createInitialData(): IInternshipData {
  return {
    student: {
      fullName: '',
      email: '',
      address: '',
      phone: '',
      course: '',
      enrollmentYear: '',
      studentId: '',
    },
    company: {
      companyName: '',
      companyAddress: '',
      companyCnpj: '',
    },
    general: {
      startDate: '',
      endDate: '',
      hoursPerDay: 6,
      workDays: 'Segunda-feira a Sexta-feira',
      workSchedule: '',
      modality: 'Remoto',
    },
    content: {
      activities: [''],
      objectives: [''],
      schedule: [{ period: '', description: '' }],
      introduction: '',
      generalObjectives: '',
      specificObjectives: '',
      methodology: '',
      development: '',
      conclusion: '',
    },
    evaluation: {
      grades: [
        { item: 'Aquisição de Novas Experiências', grade: 10, observation: '' },
        { item: 'Acompanhamento do supervisor', grade: 10, observation: '' },
        { item: 'Interação com colegas do Trabalho', grade: 10, observation: '' },
        { item: 'Ambiente de Trabalho', grade: 10, observation: '' },
      ],
      flexibleSchedule: true,
      reducedDuringExams: false,
      requiresCompensation: false,
      caresAboutAcademics: true,
      recommendsPartnership: true,
    },
    supervision: {
      supervisorName: '',
      supervisorEmail: '',
      supervisorPhone: '',
      supervisorPosition: '',
      supervisorCpf: '',
      advisorName: '',
      advisorEmail: '',
      advisorSiape: '',
      advisorPosition: '',
    },
  };
}

// Loading fallback component
function StepLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-border dark:border-border-dark border-t-cin-red rounded-full animate-spin" />
        <p className="text-text-secondary dark:text-text-secondary-dark text-sm">Carregando...</p>
      </div>
    </div>
  );
}

// Exit Confirmation Dialog Component
interface ExitDialogProps {
  isOpen: boolean;
  onSaveAndExit: () => void;
  onExitWithoutSaving: () => void;
  onCancel: () => void;
}

function ExitConfirmDialog({ isOpen, onSaveAndExit, onExitWithoutSaving, onCancel }: ExitDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="relative bg-surface-elevated dark:bg-surface-elevated-dark rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">
          Deseja salvar seu progresso?
        </h2>
        
        <p className="text-text-secondary dark:text-text-secondary-dark mb-6">
          Você tem dados não finalizados. O que deseja fazer?
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onSaveAndExit}
            className="w-full py-3 px-4 bg-cin-red text-white rounded-lg font-medium hover:bg-cin-red/90 transition-colors"
          >
            Salvar para continuar depois
          </button>
          
          <button
            onClick={onExitWithoutSaving}
            className="w-full py-3 px-4 bg-text-secondary/20 dark:bg-text-secondary-dark/20 text-text-primary dark:text-text-primary-dark rounded-lg font-medium hover:bg-text-secondary/30 dark:hover:bg-text-secondary-dark/30 transition-colors"
          >
            Sair sem salvar
          </button>
          
          <button
            onClick={onCancel}
            className="w-full py-2 px-4 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// Reset Confirmation Dialog Component
interface ResetDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ResetConfirmDialog({ isOpen, onConfirm, onCancel }: ResetDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="relative bg-surface-elevated dark:bg-surface-elevated-dark rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">
          Apagar todos os dados?
        </h2>
        
        <p className="text-text-secondary dark:text-text-secondary-dark mb-6">
          Esta ação irá remover todos os dados salvos e reiniciar o formulário. Esta ação não pode ser desfeita.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Apagar dados e reiniciar
          </button>
          
          <button
            onClick={onCancel}
            className="w-full py-2 px-4 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// Import Confirmation Dialog Component
interface ImportDialogProps {
  isOpen: boolean;
  previewData: PersistedWizardState | null;
  onConfirm: () => void;
  onCancel: () => void;
  error?: string;
}

function ImportConfirmDialog({ isOpen, previewData, onConfirm, onCancel, error }: ImportDialogProps) {
  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString('pt-BR');
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-surface-elevated dark:bg-surface-elevated-dark rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        {error ? (
          <>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-3">
              Erro ao importar
            </h2>
            <p className="text-text-secondary dark:text-text-secondary-dark mb-6">
              {error}
            </p>
            <button
              onClick={onCancel}
              className="w-full py-3 px-4 bg-text-secondary/20 dark:bg-text-secondary-dark/20 text-text-primary dark:text-text-primary-dark rounded-lg font-medium hover:bg-text-secondary/30 dark:hover:bg-text-secondary-dark/30 transition-colors"
            >
              Fechar
            </button>
          </>
        ) : previewData ? (
          <>
            <h2 className="text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">
              Importar progresso?
            </h2>

            <div className="bg-surface dark:bg-surface-dark rounded-lg p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-text-secondary-dark">Aluno:</span>
                <span className="text-text-primary dark:text-text-primary-dark font-medium">
                  {previewData.data.student.fullName || '(não preenchido)'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-text-secondary-dark">Passo atual:</span>
                <span className="text-text-primary dark:text-text-primary-dark font-medium">
                  {previewData.currentStep} de 8
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-text-secondary-dark">Salvo em:</span>
                <span className="text-text-primary dark:text-text-primary-dark font-medium">
                  {formatDate(previewData.savedAt)}
                </span>
              </div>
            </div>

            <p className="text-text-secondary dark:text-text-secondary-dark mb-6 text-sm">
              Isso irá substituir todos os dados atuais. Deseja continuar?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                className="w-full py-3 px-4 bg-cin-red text-white rounded-lg font-medium hover:bg-cin-red/90 transition-colors"
              >
                Importar e substituir
              </button>

              <button
                onClick={onCancel}
                className="w-full py-2 px-4 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors text-sm"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function WizardContainer() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [data, setData] = useState<IInternshipData>(createInitialData);
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importPreview, setImportPreview] = useState<PersistedWizardState | null>(null);
  const [importError, setImportError] = useState<string | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { saveProgress, loadProgress, clearProgress, hasProgress, exportProgress, importProgress } = useWizardPersistence();

  // Load saved progress on mount
  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setData(saved.data);
      setCurrentStep(saved.currentStep);
      setCompletedSteps(saved.completedSteps);
    }
    setIsInitialized(true);
  }, [loadProgress]);

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show warning if there's progress (not on step 1 with empty data)
      if (completedSteps.length > 0 || currentStep > 1) {
        e.preventDefault();
        // Modern browsers ignore custom messages, but we still need to set returnValue
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [completedSteps, currentStep]);

  // Save progress helper
  const persistProgress = useCallback((newData: IInternshipData, step: WizardStep, newCompletedSteps: WizardStep[]) => {
    saveProgress(newData, step, newCompletedSteps);
  }, [saveProgress]);

  // Navigation helpers
  const goToStep = (step: WizardStep) => setCurrentStep(step);
  
  const nextStep = () => {
    const next = Math.min(currentStep + 1, TOTAL_STEPS) as WizardStep;
    setCurrentStep(next);
  };
  
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1) as WizardStep);

  // Data update handlers with persistence
  const handleStudentUpdate = (studentData: IStudentData) => {
    const newData = { ...data, student: studentData };
    const newCompleted = [...new Set([...completedSteps, 2 as WizardStep])];
    setData(newData);
    setCompletedSteps(newCompleted);
    persistProgress(newData, 3 as WizardStep, newCompleted);
    nextStep();
  };

  const handleCompanyUpdate = (companyData: ICompanyData) => {
    const newData = { ...data, company: companyData };
    const newCompleted = [...new Set([...completedSteps, 3 as WizardStep])];
    setData(newData);
    setCompletedSteps(newCompleted);
    persistProgress(newData, 4 as WizardStep, newCompleted);
    nextStep();
  };

  const handleGeneralUpdate = (generalData: IInternshipGeneral) => {
    const newData = { ...data, general: generalData };
    const newCompleted = [...new Set([...completedSteps, 4 as WizardStep])];
    setData(newData);
    setCompletedSteps(newCompleted);
    persistProgress(newData, 5 as WizardStep, newCompleted);
    nextStep();
  };

  const handleContentUpdate = (contentData: IInternshipContent) => {
    const newData = { ...data, content: contentData };
    const newCompleted = [...new Set([...completedSteps, 5 as WizardStep])];
    setData(newData);
    setCompletedSteps(newCompleted);
    persistProgress(newData, 6 as WizardStep, newCompleted);
    nextStep();
  };

  const handleSupervisionUpdate = (supervisionData: ISupervisionData) => {
    const newData = { ...data, supervision: supervisionData };
    const newCompleted = [...new Set([...completedSteps, 6 as WizardStep])];
    setData(newData);
    setCompletedSteps(newCompleted);
    persistProgress(newData, 7 as WizardStep, newCompleted);
    nextStep();
  };

  // Exit dialog handlers
  const handleSaveAndExit = () => {
    saveProgress(data, currentStep, completedSteps);
    setShowExitDialog(false);
    // Allow navigation
    window.removeEventListener('beforeunload', () => {});
  };

  const handleExitWithoutSaving = () => {
    clearProgress();
    setShowExitDialog(false);
    // Reset state
    setData(createInitialData());
    setCurrentStep(1);
    setCompletedSteps([]);
  };

  // Handle reset
  const handleReset = () => {
    clearProgress();
    setShowResetDialog(false);
    setData(createInitialData());
    setCurrentStep(1);
    setCompletedSteps([]);
  };

  // Handle export
  const handleExport = () => {
    exportProgress();
  };

  // Handle import file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await importProgress(file);
    
    if (result.success && result.state) {
      setImportPreview(result.state);
      setImportError(undefined);
    } else {
      setImportPreview(null);
      setImportError(result.error);
    }
    
    setShowImportDialog(true);
    
    // Reset file input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle import confirmation
  const handleImportConfirm = () => {
    if (importPreview) {
      setData(importPreview.data);
      setCurrentStep(importPreview.currentStep);
      setCompletedSteps(importPreview.completedSteps);
      saveProgress(importPreview.data, importPreview.currentStep, importPreview.completedSteps);
    }
    setShowImportDialog(false);
    setImportPreview(null);
  };

  // Handle import cancel
  const handleImportCancel = () => {
    setShowImportDialog(false);
    setImportPreview(null);
    setImportError(undefined);
  };

  // Memoized step props based on current step
  const stepProps = useMemo(() => {
    switch (currentStep) {
      case 1:
        return { onNext: nextStep };
      case 2:
        return { data: data.student, onNext: handleStudentUpdate };
      case 3:
        return { data: data.company, onNext: handleCompanyUpdate, onBack: prevStep };
      case 4:
        return { data: data.general, onNext: handleGeneralUpdate, onBack: prevStep };
      case 5:
        return { data: data.content, onNext: handleContentUpdate, onBack: prevStep };
      case 6:
        return { data: data.supervision, onNext: handleSupervisionUpdate, onBack: prevStep };
      case 7:
        return { data, onNext: nextStep, onBack: prevStep, onEdit: (step: number) => goToStep(step as WizardStep) };
      case 8:
      default:
        return { data, onBack: prevStep };
    }
  }, [currentStep, data]);

  // Get current step component from registry
  const StepComponent = STEP_REGISTRY[currentStep];

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-surface dark:bg-surface-dark flex items-center justify-center">
        <StepLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      {/* Exit Confirmation Dialog */}
      <ExitConfirmDialog
        isOpen={showExitDialog}
        onSaveAndExit={handleSaveAndExit}
        onExitWithoutSaving={handleExitWithoutSaving}
        onCancel={() => setShowExitDialog(false)}
      />

      {/* Reset Confirmation Dialog */}
      <ResetConfirmDialog
        isOpen={showResetDialog}
        onConfirm={handleReset}
        onCancel={() => setShowResetDialog(false)}
      />

      {/* Import Confirmation Dialog */}
      <ImportConfirmDialog
        isOpen={showImportDialog}
        previewData={importPreview}
        onConfirm={handleImportConfirm}
        onCancel={handleImportCancel}
        error={importError}
      />

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header */}
      <header className="bg-surface-elevated dark:bg-surface-elevated-dark border-b border-border dark:border-border-dark">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {/* Logo placeholder */}
            <div className="w-12 h-12 bg-cin-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CIn</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">
                Documentos de Estágio
              </h1>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                Centro de Informática - UFPE
              </p>
            </div>
            
            {/* Progress tools and indicator */}
            <div className="ml-auto flex items-center gap-2">
              {/* Import button - always visible */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors px-3 py-1.5 rounded-md hover:bg-text-secondary/10 dark:hover:bg-text-secondary-dark/10"
                title="Importar progresso de arquivo JSON"
              >
                Importar
              </button>

              {/* Export and clear - only when there's progress */}
              {hasProgress() && (
                <>
                  <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-text-secondary-dark">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="hidden sm:inline">Salvo</span>
                  </div>

                  <button
                    onClick={handleExport}
                    className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors px-3 py-1.5 rounded-md hover:bg-text-secondary/10 dark:hover:bg-text-secondary-dark/10"
                    title="Exportar progresso como JSON"
                  >
                    Exportar
                  </button>

                  <button
                    onClick={() => setShowResetDialog(true)}
                    className="text-sm font-medium text-cin-red hover:text-red-700 dark:hover:text-red-400 transition-colors px-3 py-1.5 rounded-md hover:bg-cin-red/10 border border-transparent hover:border-cin-red/20"
                  >
                    Limpar
                  </button>
                </>
              )}
            </div>
            
            {/* Theme Toggle */}
            <div className={hasProgress() ? '' : 'ml-auto'}>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Mobile Step Popover */}
        <div className="md:hidden mb-4">
          <MobileStepPopover currentStep={currentStep} steps={STEPS} completedSteps={completedSteps} onStepClick={goToStep} />
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Step Indicator (Desktop only) */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <StepIndicator currentStep={currentStep} steps={STEPS} completedSteps={completedSteps} onStepClick={goToStep} />
            </div>
          </aside>

          {/* Form Card */}
          <div className="flex-1 min-w-0">
            {/* Return to highest step button - shown when reviewing a previous step */}
            {(() => {
              const highestCompleted = Math.max(...completedSteps, currentStep);
              const highestStepInfo = STEPS.find(s => s.step === highestCompleted);
              if (currentStep < highestCompleted && highestStepInfo) {
                return (
                  <button
                    onClick={() => goToStep(highestCompleted as WizardStep)}
                    className="mb-4 w-full flex items-center justify-center gap-2 py-3 px-4 bg-cin-red/10 hover:bg-cin-red/20 text-cin-red rounded-lg font-medium transition-colors border border-cin-red/20"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Voltar para Passo {highestCompleted}: {highestStepInfo.title}
                  </button>
                );
              }
              return null;
            })()}
            <div className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-xl shadow-sm border border-border dark:border-border-dark p-6 md:p-8">
              <Suspense fallback={<StepLoading />}>
                <StepComponent {...stepProps} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-elevated dark:bg-surface-elevated-dark border-t border-border dark:border-border-dark mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-center text-sm text-text-secondary dark:text-text-secondary-dark">
            © {new Date().getFullYear()} Centro de Informática - UFPE
          </p>
        </div>
      </footer>
    </div>
  );
}
