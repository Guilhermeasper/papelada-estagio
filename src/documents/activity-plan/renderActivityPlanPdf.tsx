

import { pdf } from '@react-pdf/renderer';
import type { IInternshipData } from '../../types/types';
import { ActivityPlanDocument } from './ActivityPlanDocument';

export async function renderActivityPlanPdf(data: IInternshipData): Promise<Blob> {
  const blob = await pdf(<ActivityPlanDocument data={data} />).toBlob();
  return blob;
}

export async function downloadActivityPlanPdf(data: IInternshipData, filename = 'plano-de-atividades.pdf'): Promise<void> {
  const blob = await renderActivityPlanPdf(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
