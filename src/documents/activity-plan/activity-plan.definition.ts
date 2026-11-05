import { DocumentDefinition } from "@papelada-estagio/types";
import { ActivityPlanDocument } from "./ActivityPlanDocument";
import { activityPlanMetadata } from "./activity-plan.meta";

export const activityPlanDefinition: DocumentDefinition = {
  ...activityPlanMetadata,
  Component: ActivityPlanDocument,
};
