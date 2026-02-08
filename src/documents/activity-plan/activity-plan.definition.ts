import { DocumentDefinition } from "../../types/document";
import { IInternshipData } from "../../types/types";
import { fullInternshipSchema } from "../../wizard/schemas/validationSchemas";
import { ActivityPlanDocument } from "./ActivityPlanDocument";

export const activityPlanDefinition: DocumentDefinition<IInternshipData> = {
  id: "activity-plan",
  label: "Plano de Atividades",
  description: "Atividades planejadas para o período de estágio.",
  schema: fullInternshipSchema,
  Component: ActivityPlanDocument,
  filename: "plano-de-atividades.pdf",
};
