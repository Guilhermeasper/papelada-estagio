

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, ThemeToggle } from '../components';
import { StepIndicator } from '../features/wizard/StepIndicator';
import { STEPS, TOTAL_STEPS } from '../features/wizard/stepConfig';
import { PersistedWizardState, useTheme, useWizardPersistence } from '../hooks';
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

function ThemeToggleButton() {
  const { effectiveTheme, toggleTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      className="w-full justify-start px-4 py-2.5 font-normal"
    >
      {isDark ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
      {isDark ? 'Tema claro' : 'Tema escuro'}
    </Button>
  );
}


interface HeaderActionsDropdownProps {
  hasProgress: boolean;
  onImport: () => void;
  onExport: () => void;
  onReset: () => void;
}

function HeaderActionsDropdown({ hasProgress, onImport, onExport, onReset }: HeaderActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative md:hidden">

      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="icon"
        aria-label="Opções"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>

        {hasProgress && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
        )}
      </Button>


      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg shadow-lg border border-border dark:border-border-dark py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">

          {hasProgress && (
            <>
              <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary dark:text-text-secondary-dark">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Progresso salvo
              </div>
              <div className="border-t border-border dark:border-border-dark my-1" />
            </>
          )}


          <ThemeToggleButton />

          <div className="border-t border-border dark:border-border-dark my-1" />


          <Button
            onClick={() => { onImport(); setIsOpen(false); }}
            variant="ghost"
            className="w-full justify-start px-4 py-2.5 font-normal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Importar
          </Button>

          {hasProgress && (
            <>
              <Button
                onClick={() => { onExport(); setIsOpen(false); }}
                variant="ghost"
                className="w-full justify-start px-4 py-2.5 font-normal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportar
              </Button>

              <div className="border-t border-border dark:border-border-dark my-1" />

              <Button
                onClick={() => { onReset(); setIsOpen(false); }}
                variant="danger-ghost"
                className="w-full justify-start px-4 py-2.5 font-normal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpar dados
              </Button>
            </>
          )}
        </div>
      )}
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


  const handleExport = () => {
    exportProgress();
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
      <div className="min-h-screen bg-surface dark:bg-surface-dark flex items-center justify-center">
        <StepLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">

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


      <header className="bg-surface-elevated dark:bg-surface-elevated-dark border-b border-border dark:border-border-dark">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">

            <div className="w-12 h-12 bg-cin-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CIn</span>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-text-primary dark:text-text-primary-dark">
                Documentos de Estágio
              </h1>
              <p className="text-xs md:text-sm text-text-secondary dark:text-text-secondary-dark">
                Centro de Informática - UFPE
              </p>
            </div>
            

            <div className="ml-auto flex items-center gap-2">

              <HeaderActionsDropdown
                hasProgress={hasProgress()}
                onImport={() => fileInputRef.current?.click()}
                onExport={handleExport}
                onReset={() => setShowResetDialog(true)}
              />


              <div className="hidden md:flex items-center gap-2">

                {hasProgress() && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-text-secondary-dark">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Salvo</span>
                  </div>
                )}


                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="ghost"
                  size="sm"
                  title="Importar progresso de arquivo JSON"
                >
                  Importar
                </Button>


                {hasProgress() && (
                  <>
                    <Button
                      onClick={handleExport}
                      variant="ghost"
                      size="sm"
                      title="Exportar progresso como JSON"
                    >
                      Exportar
                    </Button>

                    <Button
                      onClick={() => setShowResetDialog(true)}
                      variant="danger-ghost"
                      size="sm"
                    >
                      Limpar
                    </Button>
                  </>
                )}


                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>


      <main className="max-w-6xl mx-auto px-4 py-8">

        <div className="md:hidden mb-4">
          <MobileStepPopover currentStep={currentStep} steps={STEPS} completedSteps={completedSteps} onStepClick={goToStep} />
        </div>

        <div className="flex gap-8">

          <aside className="hidden md:block w-64 flex-shrink-0">
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
      </main>

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
