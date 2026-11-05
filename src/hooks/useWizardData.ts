import { DEFAULT_WORK_DAYS } from "@papelada-estagio/constants";
import { SUPERVISOR_GRADE_ITEM } from "@papelada-estagio/constants/internshipRules";
import {
  ICompanyData,
  IEvaluationData,
  IInternshipContent,
  IInternshipData,
  IInternshipFraming,
  IInternshipGeneral,
  IStudentData,
  ISupervisionData,
  WizardStep,
} from "@papelada-estagio/types";
import { defaultWorkSchedule } from "@papelada-estagio/utils/workSchedule";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PersistedWizardState,
  useWizardPersistence,
} from "./useWizardPersistence";

function createInitialData(): IInternshipData {
  return {
    framing: {
      course: "",
      curriculumProfile: "",
      regime: "",
      declaredRequiredHours: null,
    },
    student: {
      fullName: "",
      email: "",
      address: "",
      phone: "",
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
      workDays: DEFAULT_WORK_DAYS,
      workSchedule: defaultWorkSchedule(6 * 60),
      modality: "Remoto",
    },
    content: {
      activities: [""],
      objectives: [""],
      schedule: [{ periodStart: "", periodEnd: "", description: "" }],
      introduction: "",
      generalObjectives: "",
      specificObjectives: "",
      scheduleDiscussion: "",
      methodology: "",
      development: "",
      conclusion: "",
      references: "",
    },
    evaluation: {
      grades: [
        {
          item: "Aquisição de Novas Experiências",
          grade: null,
          observation: "",
        },
        { item: SUPERVISOR_GRADE_ITEM, grade: null, observation: "" },
        {
          item: "Interação com colegas do Trabalho",
          grade: null,
          observation: "",
        },
        { item: "Ambiente de Trabalho", grade: null, observation: "" },
      ],
      flexibleSchedule: { answer: null, comment: "" },
      reducedDuringExams: { answer: null, comment: "" },
      requiresCompensation: { answer: null, comment: "" },
      caresAboutAcademics: { answer: null, comment: "" },
      recommendsPartnership: { answer: null, comment: "" },
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
      evaluationDeadline: "",
      goalsCompletionDate: "",
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
  hasProgress: boolean;
}

export interface WizardDataActions {
  setCurrentStep: (step: WizardStep) => void;
  updateFraming: (framingData: IInternshipFraming) => void;
  updateStudent: (studentData: IStudentData) => void;
  updateCompany: (companyData: ICompanyData) => void;
  updateGeneral: (generalData: IInternshipGeneral) => void;
  updateContent: (
    contentData: IInternshipContent,
    evaluationData: IEvaluationData,
  ) => void;
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
}

export function useWizardData() {
  const {
    saveProgress,
    loadProgress,
    clearProgress,
    hasProgress,
    exportProgress,
    importProgress,
  } = useWizardPersistence();

  const [saved] = useState(() => loadProgress());
  const [data, setData] = useState<IInternshipData>(
    () => saved?.data ?? createInitialData(),
  );
  const [currentStep, setCurrentStep] = useState<WizardStep>(
    saved?.currentStep ?? 1,
  );
  const [completedSteps, setCompletedSteps] = useState<WizardStep[]>(
    saved?.completedSteps ?? [],
  );

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [importDialog, setImportDialog] = useState<ImportDialogState>({
    isOpen: false,
    previewData: null,
    error: undefined,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (completedSteps.length > 0 || currentStep > 1) {
        e.preventDefault();
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

  const updateFraming = useCallback(
    (framingData: IInternshipFraming) => {
      setData((prev) => {
        const newData = { ...prev, framing: framingData };
        const newCompleted = [...new Set([...completedSteps, 1 as WizardStep])];
        setCompletedSteps(newCompleted);
        persistProgress(newData, 2 as WizardStep, newCompleted);
        return newData;
      });
      setCurrentStep(2);
    },
    [completedSteps, persistProgress],
  );

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
    (contentData: IInternshipContent, evaluationData: IEvaluationData) => {
      setData((prev) => {
        const newData = {
          ...prev,
          content: contentData,
          evaluation: evaluationData,
        };
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
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      void importProgress(file).then((result) => {
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
      });
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
    hasProgress: hasProgress(),
  };

  const actions: WizardDataActions = {
    setCurrentStep,
    updateFraming,
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
  };

  return { state, actions, dialogs, fileInputRef, handleFileSelect };
}
