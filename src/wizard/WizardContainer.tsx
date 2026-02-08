import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../components';
import { PersistedWizardState, useWizardPersistence } from '../hooks';
import {
  ICompanyData,
  IInternshipContent,
  IInternshipData,
  IInternshipGeneral,
  IStudentData,
  ISupervisionData,
  WizardStep
} from '../types/types';
import { MobileStepPopover } from './MobileStepPopover';
import { StepIndicator } from './StepIndicator';
import { STEPS, TOTAL_STEPS } from './stepConfig';
import { STEP_REGISTRY } from './stepRegistry';


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
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative bg-surface-elevated dark:bg-surface-elevated-dark rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        <h2 className="text-lg md:text-xl font-bold text-text-primary dark:text-text-primary-dark mb-3">
          Deseja salvar seu progresso?
        </h2>
        
        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mb-6">
          Você tem dados não finalizados. O que deseja fazer?
        </p>
        
        <div className="flex flex-col gap-3">
          <Button
            onClick={onSaveAndExit}
            className="w-full"
          >
            Salvar para continuar depois
          </Button>
          
          <Button
            onClick={onExitWithoutSaving}
            variant="secondary"
            className="w-full"
          >
            Sair sem salvar
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


interface ResetDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ResetConfirmDialog({ isOpen, onConfirm, onCancel }: ResetDialogProps) {
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
          Esta ação irá remover todos os dados salvos e reiniciar o formulário. Esta ação não pode ser desfeita.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button
            onClick={onConfirm}
            variant="danger"
            className="w-full"
          >
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
            <Button
              onClick={onCancel}
              variant="secondary"
              className="w-full"
            >
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
              <Button
                onClick={onConfirm}
                className="w-full"
              >
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


export interface WizardActions {
  hasProgress: boolean;
  onImport: () => void;
  onExport: () => void;
  onReset: () => void;
}

interface WizardContainerProps {
  onActionsReady?: (actions: WizardActions) => void;
}

export function WizardContainer({ onActionsReady }: WizardContainerProps) {
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


  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setData(saved.data);
      setCurrentStep(saved.currentStep);
      setCompletedSteps(saved.completedSteps);
    }
    setIsInitialized(true);
  }, [loadProgress]);


  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (completedSteps.length > 0 || currentStep > 1) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [completedSteps, currentStep]);


  const handleExport = useCallback(() => {
    exportProgress();
  }, [exportProgress]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleResetClick = useCallback(() => {
    setShowResetDialog(true);
  }, []);


  useEffect(() => {
    if (isInitialized && onActionsReady) {
      onActionsReady({
        hasProgress: hasProgress(),
        onImport: handleImportClick,
        onExport: handleExport,
        onReset: handleResetClick,
      });
    }
  }, [isInitialized, hasProgress, handleImportClick, handleExport, handleResetClick, onActionsReady]);


  const persistProgress = useCallback((newData: IInternshipData, step: WizardStep, newCompletedSteps: WizardStep[]) => {
    saveProgress(newData, step, newCompletedSteps);
  }, [saveProgress]);


  const goToStep = (step: WizardStep) => setCurrentStep(step);
  
  const nextStep = () => {
    const next = Math.min(currentStep + 1, TOTAL_STEPS) as WizardStep;
    setCurrentStep(next);
  };
  
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1) as WizardStep);


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


  const handleSaveAndExit = () => {
    saveProgress(data, currentStep, completedSteps);
    setShowExitDialog(false);
    window.removeEventListener('beforeunload', () => {});
  };

  const handleExitWithoutSaving = () => {
    clearProgress();
    setShowExitDialog(false);
    setData(createInitialData());
    setCurrentStep(1);
    setCompletedSteps([]);
  };


  const handleReset = () => {
    clearProgress();
    setShowResetDialog(false);
    setData(createInitialData());
    setCurrentStep(1);
    setCompletedSteps([]);
  };


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

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


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


  const handleImportCancel = () => {
    setShowImportDialog(false);
    setImportPreview(null);
    setImportError(undefined);
  };


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


  const StepComponent = STEP_REGISTRY[currentStep];


  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <StepLoading />
      </div>
    );
  }

  return (
    <>
      <ExitConfirmDialog
        isOpen={showExitDialog}
        onSaveAndExit={handleSaveAndExit}
        onExitWithoutSaving={handleExitWithoutSaving}
        onCancel={() => setShowExitDialog(false)}
      />

      <ResetConfirmDialog
        isOpen={showResetDialog}
        onConfirm={handleReset}
        onCancel={() => setShowResetDialog(false)}
      />

      <ImportConfirmDialog
        isOpen={showImportDialog}
        previewData={importPreview}
        onConfirm={handleImportConfirm}
        onCancel={handleImportCancel}
        error={importError}
      />

      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="md:hidden mb-4">
          <MobileStepPopover currentStep={currentStep} steps={STEPS} completedSteps={completedSteps} onStepClick={goToStep} />
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-8">
              <StepIndicator currentStep={currentStep} steps={STEPS} completedSteps={completedSteps} onStepClick={goToStep} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {(() => {
              const highestCompleted = completedSteps.length > 0 ? Math.max(...completedSteps) : 0;
              const workingStep = Math.min(highestCompleted + 1, TOTAL_STEPS) as WizardStep;
              const workingStepInfo = STEPS.find(s => s.step === workingStep);
              if (currentStep < workingStep && workingStepInfo) {
                return (
                  <Button
                    onClick={() => goToStep(workingStep)}
                    variant="outline"
                    className="mb-4 w-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Voltar para Passo {workingStep}: {workingStepInfo.title}
                  </Button>
                );
              }
              return null;
            })()}
            <div className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-xl shadow-sm border border-border dark:border-border-dark p-6 md:p-8">
              <Suspense fallback={<StepLoading />}>
                <StepComponent {...(stepProps as any)} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
