import type { DocumentType, IDocumentOption } from '../../shared/domain/types';

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
