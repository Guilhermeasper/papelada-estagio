
import { PDFViewer } from '@react-pdf/renderer';
import { ActivityPlanDocument } from '../../features/activity-plan/ActivityPlanDocument';
import { mockActivityPlanData } from '../../mocks/mockActivityPlanData';

export function ActivityPlanPage() {
  return (
    <PDFViewer style={{ width: '100vw', height: '100vh', border: 'none' }}>
      <ActivityPlanDocument data={mockActivityPlanData} />
    </PDFViewer>
  );
}
