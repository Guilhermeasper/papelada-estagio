import { pdf } from '@react-pdf/renderer';
import React from 'react';
import type { DocumentType, IInternshipData } from '../../shared/domain/types';
import { getDocumentComponent, isRegistryReady } from './documentRegistry';

export async function generateDocument(
  type: DocumentType,
  data: IInternshipData
): Promise<Uint8Array> {
  if (!isRegistryReady()) {
    throw new Error('Document registry not initialized. Call initializeDocumentRegistry() first.');
  }

  const DocComponent = getDocumentComponent(type);
  if (!DocComponent) {
    throw new Error(`Document component not registered: ${type}`);
  }

  const documentElement = React.createElement(DocComponent, { data });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = await pdf(documentElement as any).toBlob();
  const arrayBuffer = await blob.arrayBuffer();

  return new Uint8Array(arrayBuffer);
}

export async function generateDocuments(
  types: DocumentType[],
  data: IInternshipData
): Promise<Map<DocumentType, Uint8Array>> {
  const results = new Map<DocumentType, Uint8Array>();

  for (const type of types) {
    const pdfBytes = await generateDocument(type, data);
    results.set(type, pdfBytes);
  }

  return results;
}

export function downloadPdf(pdfBytes: Uint8Array, filename: string): void {
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
