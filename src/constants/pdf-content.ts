export const PDF_CONTENT = {
  header: {
    service: "SERVIÇO PÚBLICO FEDERAL",
    university: "UNIVERSIDADE FEDERAL DE PERNAMBUCO",
    department: "PRÓ-REITORIA PARA ASSUNTOS ACADÊMICOS",
    coordination: "Coordenação de Apoio Acadêmico",
    institution: "Centro de Informática",
  },
  activityPlan: {
    title: "ESTÁGIO CURRICULAR OBRIGATÓRIO",
    subtitle: "PLANO DE ATIVIDADES",
    sections: {
      student: "DADOS DE IDENTIFICAÇÃO DO ESTAGIÁRIO",
      company: "IDENTIFICAÇÃO DA EMPRESA",
      program: "PROGRAMA DE ESTÁGIO",
      supervision: "ORIENTAÇÃO E SUPERVISÃO",
      evaluation: "AVALIAÇÃO",
    },
    subsections: {
      generalInfo:
        "Informações Gerais: Período (Vigência), Carga Horária, Dias e horário",
      activities: "Atividades a serem desenvolvidas",
      objectives: "Objetivos / metas a serem atingidas",
      schedule: "Cronograma",
    },
    evaluation: {
      subtitle: "(critérios, formas, datas)",
      text1:
        "Ao fim do segundo período o supervisor produzirá um relatório acerca da integração do estagiário com a rotina da corporação e sua interação intra e extra departamental.",
      text2:
        "Para cada um dos itens abaixo será emitida uma nota de 1 a 5, sendo:",
      legends: [
        "1 – Insatisfatório",
        "2 – Pouco desenvolvido",
        "3 – Satisfatório",
        "4 – Atende acima das expectativas",
        "5 – Acima das expectativas",
      ],
      text3: "Farão parte do relatório:",
      criteria: [
        {
          topic: "Assiduidade",
          description: "Frequência e participação",
          weight: "2",
        },
        {
          topic: "Comprometimento",
          description: "Aderência a prazos e objetivos acordados",
          weight: "2",
        },
        {
          topic: "Independência",
          description: "Evolução autônoma",
          weight: "1",
        },
        {
          topic: "Criatividade",
          description: "Encontrar soluções inovadoras",
          weight: "1",
        },
        {
          topic: "Liderança",
          description: "Defesa do ponto de vista",
          weight: "1",
        },
        {
          topic: "Relacionamento",
          description: "Trabalho em equipe",
          weight: "3",
        },
        {
          topic: "Domínio Teórico",
          description: "Capacidade técnica",
          weight: "3",
        },
        { topic: "Iniciativa", description: "Ação proativa", weight: "2" },
      ],
      text4:
        "O objetivo do terceiro período é a entrega das aplicações e a avaliação da técnica e clareza do código fonte.",
      text5:
        "Será objeto desta avaliação o cumprimento das fases de Levantamento dos Requisitos, Projeto, Especificação, Codificação, Testes e Integração.",
    },
    signatures: {
      title: "Assinaturas:",
      student: "Estagiário:",
      supervisor: "Supervisor de Estágio:",
      advisor: "Orientador de Estágio:",
      coordinator: "Coordenador de Estágio ou do Curso:",
      coordinatorNote: "(Não colocar nome)",
      fields: {
        field: "(Campo de Estágio)",
        ufpe: "(UFPE)",
      },
    },
    footer:
      "O Plano de Atividades deverá ser elaborado em conformidade com as especificidades do Curso e deve ser parte integrante do Termo de Compromisso e deverá conter, obrigatoriamente, todas as assinaturas.",
  },
  report: {
    title: "Relatório de Estágio Obrigatório",
    toc: {
      title: "Índice",
      items: [
        { label: "Identificação", page: 3 },
        { label: "Introdução", page: 4 },
        { label: "Objetivos", page: 5 },
        { label: "Gerais", page: 5, indent: true },
        { label: "Específicos", page: 5, indent: true },
        { label: "Cronograma", page: 6 },
        { label: "Material e Método", page: 7 },
        { label: "Desenvolvimento", page: 8 },
        { label: "Avaliação do Estágio", page: 9 },
        { label: "Conclusão", page: 10 },
      ],
    },
    sections: {
      identification: "Identificação",
      introduction: "Introdução",
      objectives: "Objetivos",
      generalObjectives: "Gerais",
      specificObjectives: "Específicos",
      schedule: "Cronograma",
      methodology: "Material e Método",
      development: "Desenvolvimento",
      evaluation: "Avaliação do Estágio",
      conclusion: "Conclusão",
    },
    text: {
      specificObjectivesIntro:
        "Conforme estabelecido no Plano de Atividades, os objetivos específicos incluíram:",
      scheduleIntro:
        "O cronograma executado seguiu a dinâmica dos projetos da empresa, dividindo-se em três grandes fases:",
    },
    evaluationQuestions: [
      "A concedente permite flexibilidade de horário?",
      "A concedente reduz sua jornada de trabalho no período próximo a provas e/ou trabalhos?",
      "Quando reduz sua jornada de trabalho por causa de provas e/ou trabalhos, a concedente exige que você compense estas horas?",
      "A concedente se preocupa com seu desempenho acadêmico?",
      "Você considera que a UFPE deve manter o convênio com a instituição concedente para que outros estudantes façam estágio nela?",
    ],
  },
  evaluationDocument: {
    supervisor: {
      title: "Avaliação do Supervisor do Estágio",
      lastRowLabel: "Nome do supervisor:",
      signatureLabel: "Supervisor do Estágio",
    },
    advisor: {
      title: "Avaliação do Professor Orientador",
      lastRowLabel: "Nome do Professor Orientador:",
      signatureLabel: "Professor Orientador",
    },
    shared: {
      subtitle: "Estágio Supervisionado",
      sections: {
        identification: "Identificação",
        evaluation: "Avaliação",
      },
      intro:
        "Como você avalia o desempenho do estagiário em cada um dos aspectos a seguir:",
      criteria: [
        { key: "communication", label: "Facilidade de comunicação" },
        { key: "attendance", label: "Assiduidade" },
        {
          key: "cooperation",
          label: "Disposição para ajudar/cooperar com colaboradores",
        },
        {
          key: "independence",
          label:
            "Capacidade para desenvolver as atividades sem depender dos outros",
        },
        {
          key: "knowledgeLevel",
          label:
            "Nível de conhecimento para desenvolver as atividades relacionadas ao estágio",
        },
        {
          key: "overallPerformance",
          label:
            "Avaliação geral do desempenho do estagiário na execução das atividades",
        },
      ],
      comments: {
        title:
          "Caso deseje, utilize o espaço abaixo para uma avaliação mais detalhada sobre o estagiário.",
      },
      datePrefix: "Data:",
    },
  },
};
