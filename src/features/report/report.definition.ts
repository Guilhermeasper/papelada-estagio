
import { DocumentDefinition } from '../../types/document';
import { IInternshipData } from '../../types/types';
import { fullInternshipSchema } from '../wizard/schemas/validationSchemas';
import { ReportDocument } from './ReportDocument';

export const reportDefinition: DocumentDefinition<IInternshipData> = {
  id: 'report',
  label: 'Relatório de Estágio',
  description: 'Relatório final detalhando as atividades realizadas.',
  schema: fullInternshipSchema,
  Component: ReportDocument,
  filename: 'relatorio-estagio.pdf',
};
