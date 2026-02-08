export interface ChecklistItemData {
  label?: string;
  content: string;
}

export interface ChecklistCardData {
  title: string;
  description: string;
  items: ChecklistItemData[];
}

export const checklistData: ChecklistCardData[] = [
  {
    title: "Plano de Atividades (Modelo CIn)",
    description: "Documento de formalização inicial do estágio",
    items: [
      {
        label: "Dados do Estagiário",
        content:
          "Nome, E-mail, Endereço, Telefone, Curso, Ano de Ingresso, Matrícula",
      },
      {
        label: "Identificação da Empresa",
        content: "Razão Social, Endereço, CNPJ",
      },
      {
        label: "Programa de Estágio",
        content:
          "Período (Início/Fim), Carga Horária diária, Dias da semana, Horário, Modalidade",
      },
      {
        label: "Conteúdo Técnico",
        content: "Lista de atividades, Objetivos/metas, Cronograma detalhado",
      },
      {
        label: "Supervisão",
        content:
          "Dados do Supervisor (empresa) e do Professor Orientador (CIn)",
      },
      {
        label: "Critérios de Avaliação",
        content:
          "Data do parecer, Pesos (Assiduidade, Comprometimento, Independência, etc.)",
      },
    ],
  },
  {
    title: "Declaração da Empresa (Vínculo CLT)",
    description: "Substitui o TCE para alunos com contrato CLT",
    items: [
      {
        label: "Identificação do Vínculo",
        content: "Nome do aluno, Matrícula, Regime CLT, Cargo, Data de início",
      },
      { label: "Carga Horária", content: "CH semanal (ex: 40 horas)" },
      {
        label: "Atividades",
        content:
          "Lista de tarefas técnicas com correlação a Ciência da Computação",
      },
      {
        label: "Cláusula de Compatibilidade",
        content: "Declaração de compatibilidade com o Projeto Pedagógico",
      },
      {
        label: "Assinatura do Supervisor",
        content: "Nome completo, Cargo, Data",
      },
    ],
  },
  {
    title: "Cópia da Carteira de Trabalho (CTPS)",
    description: "Documento probatório exigido pela resolução",
    items: [
      { content: "Página com foto e dados de identificação do portador" },
      {
        content:
          "Página do contrato de trabalho com dados da empresa e data de admissão",
      },
    ],
  },
  {
    title: "Relatório Final de Estágio",
    description: "Relatório detalhado para conclusão da disciplina",
    items: [
      { label: "Capa", content: "UFPE, CIn, Título, Curso, Local, Mês/Ano" },
      {
        label: "Identificação",
        content: "Nome, Semestre, Empresa, Supervisor, Datas, CH, Orientador",
      },
      {
        label: "Corpo do Texto",
        content:
          "Índice, Introdução, Objetivos (Gerais/Específicos), Cronograma, Metodologia, Desenvolvimento, Conclusão",
      },
      {
        label: "Autoavaliação",
        content:
          "Notas (0-10) para Aquisição de Experiências, Acompanhamento, Interação, Ambiente",
      },
      {
        label: "Questionário da Concedente",
        content:
          "Flexibilidade, Redução em provas, Preocupação acadêmica, Convênio",
      },
    ],
  },
  {
    title: "Avaliação pelo Professor Orientador",
    description: "Parecer e nota emitidos pelo orientador do CIn",
    items: [
      {
        label: "Identificação",
        content: "Nome do aluno, Curso, Empresa, Período, Orientador",
      },
      {
        label: "Tabela de Desempenho",
        content:
          "Comunicação, Assiduidade, Cooperação, Independência, Conhecimento, Desempenho Geral",
      },
      {
        label: "Parecer e Nota",
        content: "Texto detalhado e nota final (0-10)",
      },
    ],
  },
  {
    title: "Avaliação pelo Supervisor",
    description: "Parecer e nota emitidos pelo supervisor da empresa",
    items: [
      {
        label: "Identificação",
        content: "Nome do aluno, Curso, Empresa, Período, Supervisor",
      },
      {
        label: "Tabela de Desempenho",
        content:
          "Comunicação, Assiduidade, Cooperação, Independência, Conhecimento, Desempenho Geral",
      },
      {
        label: "Parecer e Nota",
        content: "Texto com elogios/pontos de melhoria e nota final (0-10)",
      },
    ],
  },
];
