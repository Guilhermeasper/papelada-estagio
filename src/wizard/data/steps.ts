import { IStepInfo } from "@papelada-estagio/types";

export const STEPS: IStepInfo[] = [
  {
    step: 1,
    title: "Checklist",
    description: "Documentos necessários",
    requirements: [
      "Plano de Atividades (Modelo CIn)",
      "Declaração da Empresa (Vínculo CLT)",
      "Cópia da CTPS (foto e contrato)",
      "Relatório Final de Estágio",
      "Avaliação pelo Professor Orientador",
      "Avaliação pelo Supervisor",
    ],
  },
  {
    step: 2,
    title: "Dados do Aluno",
    description: "Informações pessoais e acadêmicas",
    requirements: [
      "Nome completo",
      "E-mail",
      "Endereço residencial completo",
      "Telefone",
      "Curso e Ano de Ingresso",
      "Matrícula",
    ],
  },
  {
    step: 3,
    title: "Empresa",
    description: "Dados da empresa concedente",
    requirements: ["Razão Social", "Endereço completo", "CNPJ"],
  },
  {
    step: 4,
    title: "Info. Gerais",
    description: "Período e carga horária",
    requirements: [
      "Período de vigência (Início e Fim)",
      "Carga horária diária (máx. 8h para CLT)",
      "Dias da semana",
      "Horário de trabalho (entrada, intervalo, saída)",
      "Modalidade (Presencial ou Remoto)",
    ],
  },
  {
    step: 5,
    title: "Conteúdo",
    description: "Atividades e objetivos",
    requirements: [
      "Lista de atividades a serem desenvolvidas",
      "Objetivos/metas a serem atingidas",
      "Cronograma detalhado (datas e tarefas)",
    ],
  },
  {
    step: 6,
    title: "Supervisão",
    description: "Supervisor e orientador",
    requirements: [
      "Supervisor (Empresa): Nome, E-mail, Telefone, Cargo, CPF",
      "Professor Orientador (CIn): Nome, E-mail, SIAPE, Cargo",
      "Data para emissão do parecer",
    ],
  },
  {
    step: 7,
    title: "Revisão",
    description: "Confirmar dados",
    requirements: [
      "Revisar todas as informações",
      "Corrigir dados se necessário",
    ],
  },
  {
    step: 8,
    title: "Download",
    description: "Gerar documentos",
    requirements: ["Baixar documentos gerados", "Verificar formatação"],
  },
];

export const TOTAL_STEPS = STEPS.length;
