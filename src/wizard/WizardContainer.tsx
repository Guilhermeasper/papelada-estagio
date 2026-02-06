/**
 * WizardContainer - Container principal do wizard
 * Gerencia estado e navegação entre passos
 * Refactored to use registry pattern and lazy loading
 * With localStorage persistence for progress saving
 */

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
    ICompanyData,
    IInternshipContent,
    IInternshipData,
    IInternshipGeneral,
    IStudentData,
    ISupervisionData,
    WizardStep
} from '../shared/domain/types';
import { useWizardPersistence } from '../shared/hooks';
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
        <div className="w-8 h-8 border-4 border-cin-gray border-t-cin-red rounded-full animate-spin" />
        <p className="text-cin-black/60 text-sm">Carregando...</p>
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
      <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-cin-black mb-3">
          Deseja salvar seu progresso?
        </h2>
        
        <p className="text-cin-black/70 mb-6">
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
            className="w-full py-3 px-4 bg-gray-100 text-cin-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Sair sem salvar
          </button>
          
          <button
            onClick={onCancel}
            className="w-full py-2 px-4 text-cin-black/60 hover:text-cin-black transition-colors text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export function WizardContainer() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [data, setData] = useState<IInternshipData>(createInitialData);
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { saveProgress, loadProgress, clearProgress, hasProgress } = useWizardPersistence();

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
      <div className="min-h-screen bg-cin-gray/30 flex items-center justify-center">
        <StepLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cin-gray/30">
      {/* Exit Confirmation Dialog */}
      <ExitConfirmDialog
        isOpen={showExitDialog}
        onSaveAndExit={handleSaveAndExit}
        onExitWithoutSaving={handleExitWithoutSaving}
        onCancel={() => setShowExitDialog(false)}
      />

      {/* Header */}
      <header className="bg-white border-b border-cin-gray">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {/* Logo placeholder */}
            <div className="w-12 h-12 bg-cin-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CIn</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-cin-black">
                Documentos de Estágio
              </h1>
              <p className="text-sm text-cin-black/60">
                Centro de Informática - UFPE
              </p>
            </div>
            
            {/* Progress indicator - shows if there's saved progress */}
            {hasProgress() && (
              <div className="ml-auto flex items-center gap-2 text-sm text-cin-black/50">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Progresso salvo</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Step Indicator */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <StepIndicator currentStep={currentStep} steps={STEPS} onStepClick={goToStep} />
            </div>
          </aside>

          {/* Mobile Step Indicator */}
          <div className="md:hidden mb-6 w-full">
            <div className="text-center">
              <p className="text-sm text-cin-black/60">
                Passo {currentStep} de {STEPS.length}
              </p>
              <p className="text-lg font-semibold text-cin-red">
                {STEPS.find((s) => s.step === currentStep)?.title}
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-cin-gray p-6 md:p-8">
              <Suspense fallback={<StepLoading />}>
                <StepComponent {...stepProps} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-cin-gray mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <p className="text-center text-sm text-cin-black/40">
            © {new Date().getFullYear()} Centro de Informática - UFPE
          </p>
        </div>
      </footer>
    </div>
  );
}
