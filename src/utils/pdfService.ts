import {
  getAllDocumentMetadata,
  loadDocumentDefinition,
} from "@papelada-estagio/config/documentRegistry";
import {
  DocumentType,
  IDocumentOption,
  IInternshipData,
} from "@papelada-estagio/types";
import { getDocumentStatus } from "@papelada-estagio/wizard/schemas/documentStatus";
import type { DocumentProps } from "@react-pdf/renderer";
import React from "react";
import { toIsoString } from "./dateUtils";

export const documentOptions: IDocumentOption[] = getAllDocumentMetadata().map(
  (def) => ({
    id: def.id as DocumentType,
    label: def.label,
    description: def.description,
    filename: def.filename,
  }),
);

export function getDocumentInfo(
  type: DocumentType,
): IDocumentOption | undefined {
  return documentOptions.find((opt) => opt.id === type);
}

async function generateDocument(
  type: DocumentType,
  data: IInternshipData,
): Promise<Uint8Array> {
  const [renderer, docDef] = await Promise.all([
    import("@react-pdf/renderer"),
    loadDocumentDefinition(type),
  ]);

  if (!docDef) {
    throw new Error(`Document component not found: ${type}`);
  }

  const documentElement = React.createElement(docDef.Component, { data });

  const blob = await renderer
    .pdf(documentElement as React.ReactElement<DocumentProps>)
    .toBlob();
  const arrayBuffer = await blob.arrayBuffer();

  return new Uint8Array(arrayBuffer);
}

function downloadPdf(pdfBytes: Uint8Array, filename: string): void {
  if (pdfBytes.length === 0) {
    throw new Error("Invalid PDF data: bytes array is empty or undefined");
  }
  if (!filename) {
    throw new Error("Invalid filename: filename is required");
  }

  const blob = new Blob([new Uint8Array(pdfBytes)], {
    type: "application/pdf",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
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
    data: IInternshipData,
  ): Promise<GenerationResult> {
    const { blocking } = getDocumentStatus(type, data, toIsoString(new Date()));
    if (blocking.length > 0) {
      return { success: false, error: blocking.join(" ") };
    }

    try {
      const pdfBytes = await generateDocument(type, data);
      return { success: true, pdfBytes };
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      return { success: false, error: `Falha ao gerar ${type}: ${message}` };
    }
  },

  async generateDocuments(
    types: DocumentType[],
    data: IInternshipData,
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
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      return { success: false, error: `Falha no download: ${message}` };
    }
  },

  async generateAndDownload(
    type: DocumentType,
    data: IInternshipData,
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
