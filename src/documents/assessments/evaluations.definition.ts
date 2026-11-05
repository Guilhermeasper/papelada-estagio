import { AdvisorEvaluationDocument } from "@papelada-estagio/documents/advisor-eval/AdvisorEvaluationDocument";
import { SupervisorEvaluationDocument } from "@papelada-estagio/documents/supervisor-eval/SupervisorEvaluationDocument";
import { DocumentDefinition, IInternshipData } from "@papelada-estagio/types";
import React from "react";
import { IEvaluationFormData } from "./EvaluationDocument";
import {
  advisorEvaluationMetadata,
  supervisorEvaluationMetadata,
} from "./evaluations.meta";

function getDefaultEvaluationData(): IEvaluationFormData {
  return {
    communication: undefined,
    attendance: undefined,
    cooperation: undefined,
    independence: undefined,
    knowledgeLevel: undefined,
    overallPerformance: undefined,
    detailedComments: undefined,
    finalGrade: undefined,
    evaluationDate: undefined,
  };
}

function AdvisorEvalWrapper({ data }: { data: IInternshipData }) {
  return React.createElement(AdvisorEvaluationDocument, {
    data,
    evaluation: getDefaultEvaluationData(),
  });
}

function SupervisorEvalWrapper({ data }: { data: IInternshipData }) {
  return React.createElement(SupervisorEvaluationDocument, {
    data,
    evaluation: getDefaultEvaluationData(),
  });
}

export const advisorEvaluationDefinition: DocumentDefinition = {
  ...advisorEvaluationMetadata,
  Component: AdvisorEvalWrapper,
};

export const supervisorEvaluationDefinition: DocumentDefinition = {
  ...supervisorEvaluationMetadata,
  Component: SupervisorEvalWrapper,
};
