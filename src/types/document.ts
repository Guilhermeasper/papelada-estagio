import React from "react";
import type { IInternshipData } from "./internship";

export type DocumentType =
  | "report"
  | "activity-plan"
  | "advisor-eval"
  | "supervisor-eval";

export interface DocumentMetadata {
  id: string;
  label: string;
  description: string;
  filename: string;
}

export interface IDocumentOption extends DocumentMetadata {
  id: DocumentType;
}

export interface IDocumentGenerator extends DocumentMetadata {
  generate(data: IInternshipData): Promise<Uint8Array>;
}

export interface DocumentDefinition extends DocumentMetadata {
  Component: React.ComponentType<{ data: IInternshipData }>;
}
