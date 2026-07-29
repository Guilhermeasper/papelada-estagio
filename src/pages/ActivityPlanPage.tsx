import { PDFPageViewer } from "@papelada-estagio/components/pdf";
import { ActivityPlanDocument } from "@papelada-estagio/documents/activity-plan/ActivityPlanDocument";
import { mockActivityPlanData } from "@papelada-estagio/mocks/mockActivityPlanData";

export function ActivityPlanPage() {
  return (
    <PDFPageViewer>
      <ActivityPlanDocument data={mockActivityPlanData} />
    </PDFPageViewer>
  );
}
