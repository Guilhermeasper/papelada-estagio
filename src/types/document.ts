import React from "react";
import { z } from "zod";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the registry holds definitions for different data types
export interface DocumentDefinition<T = any> extends DocumentMetadata {
  schema: z.ZodType<T>;
  Component: React.ComponentType<{ data: T }>;
}
