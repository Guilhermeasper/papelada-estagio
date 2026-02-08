import React from "react";
import { z } from "zod";
import type { IInternshipData } from "./internship";

export type DocumentType =
  | "report"
  | "activity-plan"
  | "advisor-eval"
  | "supervisor-eval";

export interface IDocumentOption {
  id: DocumentType;
  label: string;
  description: string;
  filename: string;
}

export interface IDocumentGenerator {
  id: string;
  label: string;
  description: string;
  generate(data: IInternshipData): Promise<Uint8Array>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DocumentDefinition<T = any> {
  id: string;
  label: string;
  description: string;
  schema: z.ZodType<T>;
  Component: React.ComponentType<{ data: T }>;
  filename: string;
}
