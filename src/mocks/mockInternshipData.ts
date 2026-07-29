import type { IInternshipData } from "@papelada-estagio/types";

export const mockInternshipData: IInternshipData = {
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
    workDays: [1, 2, 3, 4, 5],
    workSchedule: {
      morning: { start: 540, end: 720 },
      afternoon: { start: 780, end: 1080 },
    },
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
        period: "Novembro/2025",
        description:
          "Descrição de exemplo para o primeiro período do cronograma, usada apenas para testes de layout.",
      },
      {
        period: "Dezembro/2025",
        description:
          "Descrição de exemplo para o segundo período do cronograma, com comprimento equivalente ao original.",
      },
      {
        period: "Janeiro/2026",
        description:
          "Descrição de exemplo para o terceiro período do cronograma, mantida somente para validação visual.",
      },
    ],
    introduction:
      "Texto de exemplo utilizado para preencher a seção de introdução do relatório e validar o comportamento do documento gerado. Este conteúdo não descreve nenhuma experiência real e existe apenas para que a paginação, o alinhamento e a quebra de parágrafos possam ser conferidos com um volume de texto semelhante ao de um relatório preenchido. Qualquer semelhança com uma organização, projeto ou pessoa é meramente coincidental, já que todos os campos deste arquivo são valores fictícios de demonstração.",
    generalObjectives:
      "Objetivo geral de exemplo, escrito apenas para ocupar o espaço reservado a esta seção no documento e permitir a conferência do layout com um texto de comprimento realista.",
    specificObjectives: "",
    methodology:
      "Metodologia de exemplo descrita somente para fins de demonstração do documento. O texto ocupa um volume semelhante ao de uma seção preenchida, permitindo verificar espaçamento entre linhas, margens e o comportamento das quebras de página. Nenhuma ferramenta, processo ou prática citada aqui corresponde a uma situação real, pois todo o conteúdo deste arquivo é um valor fictício mantido apenas para testes.",
    development: `Texto de exemplo para a seção de desenvolvimento, organizado em tópicos para reproduzir a estrutura de um relatório preenchido:

1. Primeiro Tópico de Exemplo - Parágrafo de preenchimento utilizado para validar o alinhamento do texto, o recuo dos tópicos numerados e a quebra de linha dentro de blocos mais longos. O conteúdo não descreve nenhuma atividade real e serve apenas como massa de teste para a geração do PDF.

2. Segundo Tópico de Exemplo - Parágrafo de preenchimento com comprimento semelhante ao anterior, mantido para que a distribuição do texto entre as páginas seja verificada em condições próximas às de um documento completo.

3. Terceiro Tópico de Exemplo - Parágrafo de preenchimento destinado a conferir o comportamento do documento quando a seção se estende por mais de uma página, incluindo a repetição de cabeçalhos e a numeração das páginas.

4. Quarto Tópico de Exemplo - Parágrafo final de preenchimento, encerrando a seção com um volume de texto equivalente ao dos demais tópicos e permitindo a validação do espaçamento antes da conclusão.`,
    conclusion:
      "Conclusão de exemplo utilizada apenas para preencher a última seção do relatório e permitir a conferência do layout do documento gerado. O texto tem comprimento semelhante ao de uma conclusão real, de modo que o espaçamento, as margens e a assinatura ao final da página possam ser avaliados. Nenhuma informação aqui apresentada corresponde a uma experiência, organização ou pessoa real, pois todos os campos deste arquivo são valores fictícios de demonstração.",
  },
  evaluation: {
    grades: [
      {
        item: "Aquisição de Novas Experiências",
        grade: 10,
        observation:
          "Observação de exemplo para o primeiro item de avaliação, com comprimento suficiente para testar a quebra de linha dentro da célula da tabela.",
      },
      {
        item: "Acompanhamento do supervisor",
        grade: 10,
        observation:
          "Observação de exemplo para o segundo item de avaliação, mantida apenas para validação visual do documento gerado.",
      },
      {
        item: "Interação com colegas do Trabalho",
        grade: 10,
        observation:
          "Observação de exemplo para o terceiro item de avaliação, escrita somente para ocupar o espaço reservado a este campo na tabela.",
      },
      {
        item: "Ambiente de Trabalho",
        grade: 10,
        observation:
          "Observação de exemplo para o quarto item de avaliação, com texto de preenchimento equivalente ao dos demais itens da lista.",
      },
    ],
    flexibleSchedule: true,
    reducedDuringExams: false,
    requiresCompensation: false,
    caresAboutAcademics: true,
    recommendsPartnership: true,
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
