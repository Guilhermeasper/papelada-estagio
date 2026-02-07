/**
 * PdfService - Encapsulates PDF generation with proper error handling
 */

import {
    documentOptions,
    downloadPdf,
    generateDocument,
    getDocumentInfo
} from '../../core/document-generation';
import { DocumentType, IDocumentOption, IInternshipData } from '../domain/types';

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
