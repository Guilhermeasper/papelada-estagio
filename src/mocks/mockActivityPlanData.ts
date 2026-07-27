import type { IInternshipData } from "@papelada-estagio/types";

export const mockActivityPlanData: IInternshipData = {
  student: {
    fullName: "João da Silva",
    email: "joao.silva@exemplo.com",
    address: "Rua das Flores, 123 - Centro - Cidade - UF",
    phone: "(81) 99999-9999",
    course: "Ciência da Computação",
    enrollmentYear: "2020.1",
    studentId: "12345678900",
  },
  company: {
    companyName: "Empresa Modelo Ltda",
    companyAddress:
      "AVENIDA DAS NAÇÕES, 1000, SALA 101 A 105 - CENTRO, CIDADE - UF",
    companyCnpj: "00.000.000/0001-00",
  },
  general: {
    startDate: "2025-11-19",
    endDate: "2026-01-14",
    hoursPerDay: 8,
    workDays: "Segunda-Feira à sexta-feira",
    workSchedule: "Das 9:00h às 12:00h e 13:00h às 18:00h",
    modality: "Remoto",
  },
  content: {
    activities: [
      "Primeira atividade de exemplo prevista para o período de estágio supervisionado;",
      "Segunda atividade de exemplo, utilizada apenas para validação do layout do documento;",
      "Terceira atividade de exemplo, com texto de preenchimento de comprimento equivalente;",
      "Quarta atividade de exemplo, sem qualquer vínculo com dados reais de estágio;",
      "Quinta atividade de exemplo, mantida somente para testes de quebra de linha e paginação.",
    ],
    objectives: [
      "Primeiro objetivo de exemplo definido para o período de estágio supervisionado;",
      "Segundo objetivo de exemplo, utilizado apenas para validação visual do documento;",
      "Terceiro objetivo de exemplo, com texto de preenchimento de comprimento equivalente;",
      "Quarto objetivo de exemplo, sem qualquer vínculo com dados reais de estágio;",
      "Quinto objetivo de exemplo, mantido somente para testes de layout e paginação.",
    ],
    schedule: [
      {
        period: "19/11/2025 a 30/11/2025",
        description:
          "Descrição de exemplo para o primeiro período do cronograma. O texto ocupa um volume semelhante ao de um plano de atividades preenchido, permitindo conferir o alinhamento, o espaçamento entre as linhas e a quebra de página da tabela. Nenhuma atividade descrita aqui corresponde a uma situação real.",
      },
      {
        period: "01/12/2025 a 23/12/2025",
        description:
          "Descrição de exemplo para o segundo período do cronograma. O conteúdo existe apenas como massa de teste para a geração do PDF e mantém comprimento equivalente ao do primeiro período, de modo que a distribuição do texto entre as células possa ser avaliada.",
      },
      {
        period: "29/12/2025 a 14/01/2026",
        description:
          "Descrição de exemplo para o terceiro período do cronograma. Assim como os demais campos deste arquivo, trata-se de um valor fictício mantido somente para validação visual do documento gerado e das quebras de linha em textos mais longos.",
      },
    ],
    introduction: "",
    generalObjectives: "",
    specificObjectives: "",
    methodology: "",
    development: "",
    conclusion: "",
  },
  evaluation: {
    grades: [],
    flexibleSchedule: false,
    reducedDuringExams: false,
    requiresCompensation: false,
    caresAboutAcademics: false,
    recommendsPartnership: false,
  },
  supervision: {
    supervisorName: "Maria Oliveira",
    supervisorEmail: "maria.oliveira@exemplo.com",
    supervisorPhone: "(31) 3333-4444",
    supervisorPosition: "Team Lead",
    supervisorCpf: "111.222.333-44",
    advisorName: "Prof. Dr. Carlos Santos",
    advisorEmail: "carlos.santos@exemplo.com",
    advisorSiape: "1234567",
    advisorPosition: "Professor Adjunto I",
    evaluationDeadline: "2026-01-26",
  },
};
