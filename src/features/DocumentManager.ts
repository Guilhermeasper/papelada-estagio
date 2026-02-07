/**
 * DocumentManager - Orquestrador de geradores de documentos
 * Utiliza @react-pdf/renderer para gerar PDFs dinamicamente
 */

import { pdf } from '@react-pdf/renderer';
import React from 'react';
import {
  AdvisorEvaluationDocument,
  SupervisorEvaluationDocument,
  type IEvaluationData
} from '../shared/components/pdf';
import { DocumentType, IDocumentOption, IInternshipData } from '../shared/domain/types';
import { ActivityPlanDocument } from './activity-plan/ActivityPlanDocument';
import { ReportDocument } from './report/ReportDocument';

// Opções de documentos para UI
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

/**
 * Gera dados padrão de avaliação para os formulários de avaliação
 * Estes são valores padrão que podem ser customizados futuramente
 */
function getDefaultEvaluationData(): IEvaluationData {
  return {
    // Return empty data to let the user fill manually
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

/**
 * Gera um documento específico usando React-PDF
 */
export async function generateDocument(
  type: DocumentType,
  data: IInternshipData
): Promise<Uint8Array> {
  let documentElement: React.ReactElement;
  
  switch (type) {
    case 'report':
      documentElement = React.createElement(ReportDocument, { data });
      break;
    case 'activity-plan':
      documentElement = React.createElement(ActivityPlanDocument, { data });
      break;
    case 'advisor-eval':
      documentElement = React.createElement(AdvisorEvaluationDocument, { 
        data, 
        evaluation: getDefaultEvaluationData() 
      });
      break;
    case 'supervisor-eval':
      documentElement = React.createElement(SupervisorEvaluationDocument, { 
        data, 
        evaluation: getDefaultEvaluationData() 
      });
      break;
    default:
      throw new Error(`Tipo de documento não suportado: ${type}`);
  }
  
  // Gera o PDF usando @react-pdf/renderer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = await pdf(documentElement as any).toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  
  return new Uint8Array(arrayBuffer);
}

/**
 * Gera múltiplos documentos
 */
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

/**
 * Faz download de um PDF gerado
 */
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

/**
 * Retorna informações sobre um tipo de documento
 */
export function getDocumentInfo(type: DocumentType): IDocumentOption | undefined {
  return documentOptions.find((opt) => opt.id === type);
}
