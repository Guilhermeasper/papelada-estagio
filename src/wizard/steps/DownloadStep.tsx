import { useState } from 'react';
import { Button } from '../../components';
import { pdfService } from '../../services';
import { DocumentType } from '../../types/types';
import type { IStep8Props } from '../step-types';

export function DownloadStep({ data, onBack }: IStep8Props) {
  const [selectedDocs, setSelectedDocs] = useState<Set<DocumentType>>(new Set());
  const [generating, setGenerating] = useState<DocumentType | null>(null);
  const [generated, setGenerated] = useState<Set<DocumentType>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const documentOptions = pdfService.getDocumentOptions();

  const toggleDocument = (id: DocumentType) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocs(newSelected);
  };

  const selectAll = () => {
    if (selectedDocs.size === documentOptions.length) {
      setSelectedDocs(new Set());
    } else {
      setSelectedDocs(new Set(documentOptions.map(d => d.id)));
    }
  };

  const handleDownload = async (type: DocumentType) => {
    setError(null);
    setGenerating(type);

    try {
      const result = await pdfService.generateDocument(type, data);
      if (!result.success || !result.pdfBytes) {
        throw new Error(result.error || 'Falha ao gerar documento');
      }
      const info = pdfService.getDocumentInfo(type);
      const downloadResult = pdfService.downloadPdf(result.pdfBytes, info?.filename || `${type}.pdf`);
      if (!downloadResult.success) {
        throw new Error(downloadResult.error || 'Falha ao fazer download');
      }
      setGenerated(prev => new Set([...prev, type]));
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      setError('Erro ao gerar documento. Por favor, tente novamente.');
    } finally {
      setGenerating(null);
    }
  };

  const handleDownloadAll = async () => {
    for (const type of selectedDocs) {
      await handleDownload(type);
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">Download dos Documentos</h2>
        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-1">
          Selecione os documentos que deseja gerar e fazer download.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary dark:text-text-secondary-dark">
            {selectedDocs.size} de {documentOptions.length} selecionados
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={selectAll}
            className="text-cin-red hover:text-cin-dark font-medium hover:bg-cin-red/5 p-0 px-2 h-auto"
          >
            {selectedDocs.size === documentOptions.length ? 'Desmarcar todos' : 'Selecionar todos'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentOptions.map((doc) => {
            const isSelected = selectedDocs.has(doc.id);
            const isGenerating = generating === doc.id;
            const isGenerated = generated.has(doc.id);

            return (
              <div
                key={doc.id}
                className={`
                  relative rounded-lg border-2 p-4 cursor-pointer transition-all
                  ${isSelected
                    ? 'border-cin-red bg-cin-red/5'
                    : 'border-border dark:border-border-dark hover:border-text-secondary dark:hover:border-text-secondary-dark'
                  }
                `}
                onClick={() => toggleDocument(doc.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5
                    ${isSelected ? 'bg-cin-red border-cin-red' : 'border-border dark:border-border-dark'}
                  `}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm md:text-base font-medium text-text-primary dark:text-text-primary-dark">{doc.label}</h3>
                      {isGenerated && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                          ✓ Gerado
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-text-secondary dark:text-text-secondary-dark mt-1">{doc.description}</p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(doc.id);
                    }}
                    isLoading={isGenerating}
                    disabled={isGenerating}
                    className="flex-shrink-0"
                  >
                    {isGenerating ? 'Gerando...' : 'Download'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {selectedDocs.size > 1 && (
        <div className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg p-4 flex items-center justify-between border border-border dark:border-border-dark">
          <div>
            <p className="font-medium text-text-primary dark:text-text-primary-dark">Download em lote</p>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
              Baixe todos os {selectedDocs.size} documentos selecionados
            </p>
          </div>
          <Button onClick={handleDownloadAll} disabled={generating !== null}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Baixar Selecionados
          </Button>
        </div>
      )}

      <div className="flex justify-between pt-6 border-t border-border dark:border-border-dark">
        <Button type="button" variant="ghost" onClick={onBack}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Button>

        <div className="text-sm text-text-secondary">
          {generated.size > 0 && `${generated.size} documento(s) gerado(s)`}
        </div>
      </div>
    </div>
  );
}
