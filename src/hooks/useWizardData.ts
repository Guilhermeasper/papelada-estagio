import {
  ICompanyData,
  IInternshipContent,
  IInternshipData,
  IInternshipGeneral,
  IStudentData,
  ISupervisionData,
  WizardStep,
} from "@papelada-estagio/types";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PersistedWizardState,
  useWizardPersistence,
} from "./useWizardPersistence";

function createInitialData(): IInternshipData {
  return {
    student: {
      fullName: "",
      email: "",
      address: "",
      phone: "",
      course: "",
      enrollmentYear: "",
      studentId: "",
    },
    company: {
      companyName: "",
      companyAddress: "",
      companyCnpj: "",
    },
    general: {
      startDate: "",
      endDate: "",
      hoursPerDay: 6,
      workDays: "Segunda-feira a Sexta-feira",
      workSchedule: "",
      modality: "Remoto",
    },
    content: {
      activities: [""],
      objectives: [""],
      schedule: [{ period: "", description: "" }],
      introduction: "",
      generalObjectives: "",
      specificObjectives: "",
      methodology: "",
      development: "",
      conclusion: "",
    },
    evaluation: {
      grades: [
        { item: "Aquisição de Novas Experiências", grade: 10, observation: "" },
        { item: "Acompanhamento do supervisor", grade: 10, observation: "" },
        {
          item: "Interação com colegas do Trabalho",
          grade: 10,
          observation: "",
        },
        { item: "Ambiente de Trabalho", grade: 10, observation: "" },
      ],
      flexibleSchedule: true,
      reducedDuringExams: false,
      requiresCompensation: false,
      caresAboutAcademics: true,
      recommendsPartnership: true,
    },
    supervision: {
      supervisorName: "",
      supervisorEmail: "",
      supervisorPhone: "",
      supervisorPosition: "",
      supervisorCpf: "",
      advisorName: "",
      advisorEmail: "",
      advisorSiape: "",
      advisorPosition: "",
    },
  };
}

export interface ImportDialogState {
  isOpen: boolean;
  previewData: PersistedWizardState | null;
  error?: string;
}

export interface WizardDataState {
  data: IInternshipData;
  currentStep: WizardStep;
  completedSteps: WizardStep[];
  isInitialized: boolean;
  hasProgress: boolean;
}

export interface WizardDataActions {
  setCurrentStep: (step: WizardStep) => void;
  updateStudent: (studentData: IStudentData) => void;
  updateCompany: (companyData: ICompanyData) => void;
  updateGeneral: (generalData: IInternshipGeneral) => void;
  updateContent: (contentData: IInternshipContent) => void;
  updateSupervision: (supervisionData: ISupervisionData) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  exportData: () => void;
  triggerImport: () => void;
}

export interface WizardDialogState {
  showResetDialog: boolean;
  setShowResetDialog: (show: boolean) => void;
  importDialog: ImportDialogState;
  confirmImport: () => void;
  cancelImport: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useWizardData() {
  const [data, setData] = useState<IInternshipData>(createInitialData);
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [importDialog, setImportDialog] = useState<ImportDialogState>({
    isOpen: false,
    previewData: null,
    error: undefined,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    saveProgress,
    loadProgress,
    clearProgress,
    hasProgress,
    exportProgress,
    importProgress,
  } = useWizardPersistence();

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
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [completedSteps, currentStep]);

  const persistProgress = useCallback(
    (
      newData: IInternshipData,
      step: WizardStep,
      newCompletedSteps: WizardStep[],
    ) => {
      saveProgress(newData, step, newCompletedSteps);
    },
    [saveProgress],
  );

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 8) as WizardStep);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as WizardStep);
  }, []);

  const updateStudent = useCallback(
    (studentData: IStudentData) => {
      setData((prev) => {
        const newData = { ...prev, student: studentData };
        const newCompleted = [...new Set([...completedSteps, 2 as WizardStep])];
        setCompletedSteps(newCompleted);
        persistProgress(newData, 3 as WizardStep, newCompleted);
        return newData;
      });
      nextStep();
    },
    [completedSteps, persistProgress, nextStep],
  );

  const updateCompany = useCallback(
    (companyData: ICompanyData) => {
      setData((prev) => {
        const newData = { ...prev, company: companyData };
        const newCompleted = [...new Set([...completedSteps, 3 as WizardStep])];
        setCompletedSteps(newCompleted);
        persistProgress(newData, 4 as WizardStep, newCompleted);
        return newData;
      });
      nextStep();
    },
    [completedSteps, persistProgress, nextStep],
  );

  const updateGeneral = useCallback(
    (generalData: IInternshipGeneral) => {
      setData((prev) => {
        const newData = { ...prev, general: generalData };
        const newCompleted = [...new Set([...completedSteps, 4 as WizardStep])];
        setCompletedSteps(newCompleted);
        persistProgress(newData, 5 as WizardStep, newCompleted);
        return newData;
      });
      nextStep();
    },
    [completedSteps, persistProgress, nextStep],
  );

  const updateContent = useCallback(
    (contentData: IInternshipContent) => {
      setData((prev) => {
        const newData = { ...prev, content: contentData };
        const newCompleted = [...new Set([...completedSteps, 5 as WizardStep])];
        setCompletedSteps(newCompleted);
        persistProgress(newData, 6 as WizardStep, newCompleted);
        return newData;
      });
      nextStep();
    },
    [completedSteps, persistProgress, nextStep],
  );

  const updateSupervision = useCallback(
    (supervisionData: ISupervisionData) => {
      setData((prev) => {
        const newData = { ...prev, supervision: supervisionData };
        const newCompleted = [...new Set([...completedSteps, 6 as WizardStep])];
        setCompletedSteps(newCompleted);
        persistProgress(newData, 7 as WizardStep, newCompleted);
        return newData;
      });
      nextStep();
    },
    [completedSteps, persistProgress, nextStep],
  );

  const reset = useCallback(() => {
    clearProgress();
    setShowResetDialog(false);
    setData(createInitialData());
    setCurrentStep(1);
    setCompletedSteps([]);
  }, [clearProgress]);

  const exportData = useCallback(() => {
    exportProgress();
  }, [exportProgress]);

  const triggerImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const result = await importProgress(file);

      if (result.success && result.state) {
        setImportDialog({
          isOpen: true,
          previewData: result.state,
          error: undefined,
        });
      } else {
        setImportDialog({
          isOpen: true,
          previewData: null,
          error: result.error,
        });
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [importProgress],
  );

  const confirmImport = useCallback(() => {
    if (importDialog.previewData) {
      setData(importDialog.previewData.data);
      setCurrentStep(importDialog.previewData.currentStep);
      setCompletedSteps(importDialog.previewData.completedSteps);
      saveProgress(
        importDialog.previewData.data,
        importDialog.previewData.currentStep,
        importDialog.previewData.completedSteps,
      );
    }
    setImportDialog({ isOpen: false, previewData: null, error: undefined });
  }, [importDialog.previewData, saveProgress]);

  const cancelImport = useCallback(() => {
    setImportDialog({ isOpen: false, previewData: null, error: undefined });
  }, []);

  const state: WizardDataState = {
    data,
    currentStep,
    completedSteps,
    isInitialized,
    hasProgress: hasProgress(),
  };

  const actions: WizardDataActions = {
    setCurrentStep,
    updateStudent,
    updateCompany,
    updateGeneral,
    updateContent,
    updateSupervision,
    nextStep,
    prevStep,
    reset,
    exportData,
    triggerImport,
  };

  const dialogs: WizardDialogState = {
    showResetDialog,
    setShowResetDialog,
    importDialog,
    confirmImport,
    cancelImport,
    fileInputRef,
    handleFileSelect,
  };

  return { state, actions, dialogs };
}
