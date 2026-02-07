import type React from 'react';
import type { DocumentType, IInternshipData } from '../../shared/domain/types';

/**
 * Props interface for document components
 */
export interface DocumentComponentProps {
  data: IInternshipData;
}

type DocumentComponent = React.ComponentType<DocumentComponentProps>;

interface DocumentRegistry {
  documents: Map<DocumentType, DocumentComponent>;
}

const registry: DocumentRegistry = {
  documents: new Map(),
};

/**
 * Register a document component
 */
export function registerDocument(type: DocumentType, component: DocumentComponent): void {
  registry.documents.set(type, component);
}

/**
 * Get a registered document component
 */
export function getDocumentComponent(type: DocumentType): DocumentComponent | undefined {
  return registry.documents.get(type);
}

/**
 * Check if all required documents are registered
 */
export function isRegistryReady(): boolean {
  return (
    registry.documents.has('report') &&
    registry.documents.has('activity-plan') &&
    registry.documents.has('advisor-eval') &&
    registry.documents.has('supervisor-eval')
  );
}
