export interface ProcessStepData {
  label: string;
  content: string;
  link?: string;
  highlight?: boolean;
}

export interface ProcessStageData {
  title: string;
  description: string;
  steps: ProcessStepData[];
}

export const SECGRAD_FAQ_URL =
  "https://secgrad.cin.ufpe.br/perguntas-frequentes";

export const beforeStage: ProcessStageData = {
  title: "Antes de preencher",
  description:
    "Este app cobre apenas a preparação dos documentos. O processo do CIn tem outras etapas antes e depois.",
  steps: [
    {
      label: "Comece com antecedência",
      content:
        "Inicie o processo pelo menos 3 semanas antes da data de início do estágio.",
      highlight: true,
    },
    {
      label: "Consulte o site da SecGrad",
      content:
        "As regras oficiais e as perguntas frequentes ficam no site abaixo. Em caso de divergência, o site prevalece sobre este app.",
      link: SECGRAD_FAQ_URL,
    },
    {
      label: "Fale com a Secretaria da Graduação",
      content:
        "A SecGrad é o ponto de contato para orientações gerais sobre o processo.",
    },
    {
      label: "Coordenação de Estágio, só se a dúvida persistir",
      content:
        "Procure a Coordenação apenas depois de ter consultado o site e a SecGrad.",
    },
  ],
};

export const afterStage: ProcessStageData = {
  title: "Depois de baixar os documentos",
  description:
    "A geração dos PDFs é o meio do caminho. Siga a ordem abaixo para não ter a documentação devolvida.",
  steps: [
    {
      label: "Colha todas as assinaturas, exceto a da coordenação",
      content:
        "Assine e obtenha as assinaturas do supervisor da empresa e do professor orientador. Não procure a Coordenação de Estágio: a assinatura dela é a última e quem encaminha o documento é a SecGrad.",
      highlight: true,
    },
    {
      label: "Entregue à SecGrad para conferência",
      content:
        "A Secretaria da Graduação confirma o recebimento e confere a documentação.",
    },
    {
      label: "Corrija, se for solicitado",
      content:
        "Se a SecGrad apontar problemas, corrija e reenvie. Seus dados ficam salvos neste navegador: basta voltar ao formulário e gerar os documentos de novo.",
    },
    {
      label: "A SecGrad encaminha à Coordenação",
      content:
        "A Coordenação de Estágio assina e devolve à SecGrad. As regras são aplicadas sem flexibilização.",
    },
    {
      label: "Conclusão",
      content:
        "A SecGrad informa a conclusão do processo e arquiva a documentação.",
    },
  ],
};
