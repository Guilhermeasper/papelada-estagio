import { DocumentDefinition, IInternshipData } from "@papelada-estagio/types";
import { fullInternshipSchema } from "@papelada-estagio/wizard/schemas/validationSchemas";
import { ActivityPlanDocument } from "./ActivityPlanDocument";
import { activityPlanMetadata } from "./activity-plan.meta";

export const activityPlanDefinition: DocumentDefinition<IInternshipData> = {
  ...activityPlanMetadata,
  schema: fullInternshipSchema,
  Component: ActivityPlanDocument,
};
