import { AdvisorEvaluationDocument } from "@papelada-estagio/documents/advisor-eval/AdvisorEvaluationDocument";
import { SupervisorEvaluationDocument } from "@papelada-estagio/documents/supervisor-eval/SupervisorEvaluationDocument";
import { DocumentDefinition, IInternshipData } from "@papelada-estagio/types";
import { fullInternshipSchema } from "@papelada-estagio/wizard/schemas/validationSchemas";
import React from "react";
import { IEvaluationFormData } from "./pdf";

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

export const advisorEvaluationDefinition: DocumentDefinition<IInternshipData> =
  {
    id: "advisor-eval",
    label: "Avaliação do Professor Orientador",
    description: "Formulário de avaliação pelo professor.",
    schema: fullInternshipSchema,
    Component: AdvisorEvalWrapper,
    filename: "avaliacao-professor.pdf",
  };

export const supervisorEvaluationDefinition: DocumentDefinition<IInternshipData> =
  {
    id: "supervisor-eval",
    label: "Avaliação do Supervisor",
    description: "Formulário de avaliação pelo supervisor da empresa.",
    schema: fullInternshipSchema,
    Component: SupervisorEvalWrapper,
    filename: "avaliacao-supervisor.pdf",
  };
