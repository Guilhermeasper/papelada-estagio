import type { IEvaluationFormData } from "@papelada-estagio/documents/assessments/EvaluationDocument";

export const mockSupervisorEvaluationData: IEvaluationFormData = {
  communication: "Ótimo",
  attendance: "Ótimo",
  cooperation: "Ótimo",
  independence: "Ótimo",
  knowledgeLevel: "Ótimo",
  overallPerformance: "Ótimo",
  detailedComments:
    "Comentário de exemplo utilizado para preencher o campo de observações da ficha de avaliação. O texto tem comprimento semelhante ao de um parecer real, de modo que a caixa de comentários, a quebra de linha e o espaçamento até a linha de assinatura possam ser conferidos no documento gerado. Nenhuma informação aqui apresentada corresponde a uma pessoa, organização ou avaliação real, pois todos os campos deste arquivo são valores fictícios de demonstração.",
  finalGrade: 10,
  evaluationDate: "2026-01-26",
};
