/**
 * PdfService - Consolidated PDF generation service
 * Handles all document generation, download, and metadata
 */

import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { ActivityPlanDocument } from '../../features/activity-plan/ActivityPlanDocument';
import {
  AdvisorEvaluationDocument,
  SupervisorEvaluationDocument,
  type IEvaluationFormData
} from '../../features/evaluations/pdf';
import { ReportDocument } from '../../features/report/ReportDocument';
import { DocumentType, IDocumentOption, IInternshipData } from '../domain/types';

// ============================================
// Document Metadata
// ============================================

export const documentOptions: IDocumentOption[] = [
  {
    id: 'report',
    label: 'Relatório de Estágio',
    description: 'Relatório final detalhando as atividades realizadas.',
    filename: 'relatorio-estagio.pdf',
  },
  {
    id: 'activity-plan',
    label: 'Plano de Atividades',
    description: 'Atividades planejadas para o período de estágio.',
    filename: 'plano-de-atividades.pdf',
  },
  {
    id: 'advisor-eval',
    label: 'Avaliação do Professor Orientador',
    description: 'Formulário de avaliação pelo professor.',
    filename: 'avaliacao-professor.pdf',
  },
  {
    id: 'supervisor-eval',
    label: 'Avaliação do Supervisor',
    description: 'Formulário de avaliação pelo supervisor da empresa.',
    filename: 'avaliacao-supervisor.pdf',
  },
];

export function getDocumentInfo(type: DocumentType): IDocumentOption | undefined {
  return documentOptions.find((opt) => opt.id === type);
}

// ============================================
// Evaluation Wrapper Components
// ============================================

function getDefaultEvaluationData(): IEvaluationFormData {
  return {
    communication: undefined,
    attendance: undefined,
    cooperation: undefined,
    independence: undefined,
    knowledgeLevel: undefined,
    overallPerformance: undefined,
    detailedComments: undefined,
    finalGrade: undefined,
    evaluationDate: undefined,
  };
}

function AdvisorEvalWrapper({ data }: { data: IInternshipData }) {
  return React.createElement(AdvisorEvaluationDocument, { 
    data, 
    evaluation: getDefaultEvaluationData() 
  });
}

function SupervisorEvalWrapper({ data }: { data: IInternshipData }) {
  return React.createElement(SupervisorEvaluationDocument, { 
    data, 
    evaluation: getDefaultEvaluationData() 
  });
}

// ============================================
// Document Component Map
// ============================================

type DocumentComponent = React.ComponentType<{ data: IInternshipData }>;

const DOCUMENT_COMPONENTS: Record<DocumentType, DocumentComponent> = {
  'report': ReportDocument,
  'activity-plan': ActivityPlanDocument,
  'advisor-eval': AdvisorEvalWrapper,
  'supervisor-eval': SupervisorEvalWrapper,
};

// ============================================
// Core Generation Functions
// ============================================

async function generateDocument(
  type: DocumentType,
  data: IInternshipData
): Promise<Uint8Array> {
  const DocComponent = DOCUMENT_COMPONENTS[type];
  if (!DocComponent) {
    throw new Error(`Document component not found: ${type}`);
  }

  const documentElement = React.createElement(DocComponent, { data });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = await pdf(documentElement as any).toBlob();
  const arrayBuffer = await blob.arrayBuffer();

  return new Uint8Array(arrayBuffer);
}

function downloadPdf(pdfBytes: Uint8Array, filename: string): void {
  if (!pdfBytes || pdfBytes.length === 0) {
    throw new Error('Invalid PDF data: bytes array is empty or undefined');
  }
  if (!filename) {
    throw new Error('Invalid filename: filename is required');
  }

  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// ============================================
// Service Interface (with error handling)
// ============================================

export interface GenerationResult {
  success: boolean;
  pdfBytes?: Uint8Array;
  error?: string;
}

export interface DownloadResult {
  success: boolean;
  error?: string;
}

export const pdfService = {
  /**
   * Get all available document options
   */
  getDocumentOptions(): IDocumentOption[] {
    return documentOptions;
  },

  /**
   * Get info for a specific document type
   */
  getDocumentInfo(type: DocumentType): IDocumentOption | undefined {
    return getDocumentInfo(type);
  },

  /**
   * Generate a single document with error handling
   */
  async generateDocument(
    type: DocumentType, 
    data: IInternshipData
  ): Promise<GenerationResult> {
    try {
      const pdfBytes = await generateDocument(type, data);
      return { success: true, pdfBytes };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, error: `Falha ao gerar ${type}: ${message}` };
    }
  },

  /**
   * Generate multiple documents with error handling
   */
  async generateDocuments(
    types: DocumentType[], 
    data: IInternshipData
  ): Promise<Map<DocumentType, GenerationResult>> {
    const results = new Map<DocumentType, GenerationResult>();
    
    for (const type of types) {
      results.set(type, await this.generateDocument(type, data));
    }
    
    return results;
  },

  /**
   * Download a PDF with error handling
   */
  downloadPdf(pdfBytes: Uint8Array, filename: string): DownloadResult {
    try {
      downloadPdf(pdfBytes, filename);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, error: `Falha no download: ${message}` };
    }
  },

  /**
   * Generate and download a document in one operation
   */
  async generateAndDownload(
    type: DocumentType, 
    data: IInternshipData
  ): Promise<DownloadResult> {
    const info = this.getDocumentInfo(type);
    if (!info) {
      return { success: false, error: `Tipo de documento inválido: ${type}` };
    }

    const genResult = await this.generateDocument(type, data);
    if (!genResult.success || !genResult.pdfBytes) {
      return { success: false, error: genResult.error };
    }

    return this.downloadPdf(genResult.pdfBytes, info.filename);
  },
};
