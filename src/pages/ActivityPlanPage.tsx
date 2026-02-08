import { ActivityPlanDocument } from "@papelada-estagio/documents/activity-plan/ActivityPlanDocument";
import { mockActivityPlanData } from "@papelada-estagio/mocks/mockActivityPlanData";
import { PDFViewer } from "@react-pdf/renderer";

export function ActivityPlanPage() {
  return (
    <PDFViewer style={{ width: "100vw", height: "100vh", border: "none" }}>
      <ActivityPlanDocument data={mockActivityPlanData} />
    </PDFViewer>
  );
}
