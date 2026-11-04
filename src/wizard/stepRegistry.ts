import { lazy } from "react";

export const ChecklistStep = lazy(() =>
  import("./steps/ChecklistStep").then((m) => ({ default: m.ChecklistStep })),
);
export const StudentFormStep = lazy(() =>
  import("./steps/StudentFormStep").then((m) => ({
    default: m.StudentFormStep,
  })),
);
export const CompanyFormStep = lazy(() =>
  import("./steps/CompanyFormStep").then((m) => ({
    default: m.CompanyFormStep,
  })),
);
export const InternshipGeneralStep = lazy(() =>
  import("./steps/InternshipGeneralStep").then((m) => ({
    default: m.InternshipGeneralStep,
  })),
);
export const InternshipContentStep = lazy(() =>
  import("./steps/InternshipContentStep").then((m) => ({
    default: m.InternshipContentStep,
  })),
);
export const SupervisionFormStep = lazy(() =>
  import("./steps/SupervisionFormStep").then((m) => ({
    default: m.SupervisionFormStep,
  })),
);
export const ReviewStep = lazy(() =>
  import("./steps/ReviewStep").then((m) => ({ default: m.ReviewStep })),
);
export const DownloadStep = lazy(() =>
  import("./steps/DownloadStep").then((m) => ({ default: m.DownloadStep })),
);
