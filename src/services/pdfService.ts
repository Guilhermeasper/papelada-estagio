

import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { getAllDocumentDefinitions, getDocumentDefinition } from '../config/documentRegistry';
import { DocumentType, IDocumentOption, IInternshipData } from '../types/types';

export const documentOptions: IDocumentOption[] = getAllDocumentDefinitions().map(def => ({
  id: def.id as DocumentType,
  label: def.label,
  description: def.description,
  filename: def.filename,
}));

export function getDocumentInfo(type: DocumentType): IDocumentOption | undefined {
  return documentOptions.find((opt) => opt.id === type);
}

async function generateDocument(
  type: DocumentType,
  data: IInternshipData
): Promise<Uint8Array> {
  const docDef = getDocumentDefinition(type);
  
  if (!docDef) {
    throw new Error(`Document component not found: ${type}`);
  }

  // Helper type guard/cast since we know our app only uses IInternshipData for now.
  // In a more complex app, we might check docDef.schema against data.
  // Using Zod to validate and parse data ensures strong typing at runtime.
  const parsedData = docDef.schema.parse(data);

  const documentElement = React.createElement(docDef.Component, { data: parsedData });

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

  getDocumentOptions(): IDocumentOption[] {
    return documentOptions;
  },


  getDocumentInfo(type: DocumentType): IDocumentOption | undefined {
    return getDocumentInfo(type);
  },


  async generateDocument(
    type: DocumentType, 
    data: IInternshipData
  ): Promise<GenerationResult> {
    try {
      const pdfBytes = await generateDocument(type, data);
      return { success: true, pdfBytes };
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      // Enhance error message if it's a Zod error
      if (error instanceof Error && error.name === 'ZodError') {
         return { success: false, error: `Dados inválidos para ${type}: ${message}` };
      }
      return { success: false, error: `Falha ao gerar ${type}: ${message}` };
    }
  },


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


  downloadPdf(pdfBytes: Uint8Array, filename: string): DownloadResult {
    try {
      downloadPdf(pdfBytes, filename);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      return { success: false, error: `Falha no download: ${message}` };
    }
  },


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
