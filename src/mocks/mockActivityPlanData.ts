import type { IInternshipData } from "../types/types";

export const mockActivityPlanData: IInternshipData = {
  student: {
    fullName: "João da Silva",
    email: "joao.silva@email.com",
    address: "Rua das Flores, 123 - Centro - Cidade - UF",
    phone: "(99) 99999-9999",
    course: "Engenharia de Software",
    enrollmentYear: "2022.1",
    studentId: "12345678900",
  },
  company: {
    companyName: "Empresa Modelo Ltda",
    companyAddress: "Av. Principal, 1000 - Centro Empresarial - Cidade - UF",
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
      "Desenvolvimento e manutenção de componentes de interface para aplicações WEB;",
      "Desenvolvimento e implementação de scripts e rotinas de automação de processos;",
      "Refatoração de código e aplicação de padrões de projeto em sistemas existentes;",
      "Execução e manutenção de testes de software e garantia de qualidade;",
      "Gestão de configuração e preparação de versões para implantação.",
    ],
    objectives: [
      "Aplicar conhecimentos de engenharia de software na manutenção de sistemas de grande escala;",
      "Otimizar fluxos de trabalho através do desenvolvimento de ferramentas de automação;",
      "Garantir a integridade visual e funcional das aplicações através de correções e testes;",
      "Compreender e executar o ciclo de vida completo de desenvolvimento, desde a codificação até a entrega;",
      "Contribuir para a padronização e documentação de bibliotecas de software.",
    ],
    schedule: [
      {
        period: "19/11/2025 a 30/11/2025",
        description:
          "Padronização de Interface e Manutenção Corretiva. Foco na refatoração de código para adoção de novos padrões de estilização (design tokens) e renomeação de parâmetros em larga escala. Realização de correções de bugs em componentes de interface e elementos de navegação. Início do levantamento de requisitos para o sistema de automação.",
      },
      {
        period: "01/12/2025 a 23/12/2025",
        description:
          "Automação, Ferramentas Internas e QA. Desenvolvimento e implementação técnica de sistemas para automação de processos de suporte. Publicação e atualização de ferramentas de apoio ao desenvolvimento (plugins e extensões). Execução intensiva de correções em testes automatizados (end-to-end) e preparação de ambientes para releases de fim de ano.",
      },
      {
        period: "29/12/2025 a 14/01/2026",
        description:
          "Modernização de Infraestrutura e Planejamento. Execução da migração do framework principal da aplicação para versão mais recente (upgrade de versão). Modularização de componentes para arquitetura móvel (exportação standalone). Redação de especificações técnicas, documentação de requisitos e planejamento do roadmap para o próximo ciclo.",
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
    supervisorEmail: "maria.oliveira@empresa.com",
    supervisorPhone: "(99) 88888-8888",
    supervisorPosition: "Gerente de Projetos",
    supervisorCpf: "111.222.333-44",
    advisorName: "Prof. Dr. Carlos Santos",
    advisorEmail: "carlos.santos@universidade.edu",
    advisorSiape: "1234567",
    advisorPosition: "Professor Associado",
  },
};
