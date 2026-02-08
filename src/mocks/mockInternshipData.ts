import type { IInternshipData } from "../types";

export const mockInternshipData: IInternshipData = {
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
      "Implementar e padronizar sistemas de design através de tokens de estilização;",
      "Desenvolver ferramentas de automação para otimizar o suporte e o fluxo de desenvolvimento;",
      "Realizar a migração e atualização de frameworks de front-end para versões atuais;",
      "Modularizar componentes para reutilização em contextos móveis;",
      "Documentar especificações técnicas e participar do planejamento de roadmap.",
    ],
    schedule: [
      {
        period: "Novembro/2025",
        description:
          "Foco na integridade visual e aplicação de novos padrões de arquitetura de informação (tokens).",
      },
      {
        period: "Dezembro/2025",
        description:
          "Ênfase em automação de processos, correção de dívida técnica e ferramentas de design.",
      },
      {
        period: "Janeiro/2026",
        description:
          "Dedicado à atualização estrutural (migração de framework) e definições arquiteturais para componentes móveis.",
      },
    ],
    introduction:
      "O estágio foi realizado em uma empresa de tecnologia focada no desenvolvimento de produtos digitais. O período compreendeu atividades críticas no ciclo de vida do software, passando pela manutenção de interfaces, criação de ferramentas de produtividade interna e, mais recentemente, a modernização da infraestrutura tecnológica da aplicação principal. Este relatório detalha as atividades de engenharia de software desempenhadas, com ênfase na padronização de design systems, automação de fluxos de trabalho e atualização tecnológica de frameworks.",
    generalObjectives:
      "Aplicar conceitos avançados de engenharia de software na manutenção e evolução de aplicações web de grande porte, participando de decisões arquiteturais e processos de garantia de qualidade.",
    specificObjectives: "",
    methodology:
      "As atividades utilizaram uma stack de desenvolvimento web moderna. O controle de versão e a integração contínua (CI/CD) foram fundamentais para a gestão das releases. Para a modernização da aplicação, foram utilizados scripts de migração automatizada combinados com refatoração manual. A gestão de estilos foi feita através de uma arquitetura de tokens semânticos. A qualidade foi assegurada através de suítes de testes automatizados e validações de regressão visual.",
    development: `As atividades realizadas durante o período de estágio podem ser categorizadas nos seguintes tópicos principais:

1. Padronização e Design System - Uma parte substancial do trabalho envolveu a implementação e renomeação de "tokens de design". O estagiário atuou na revisão de código para garantir que os componentes da biblioteca consumissem as novas definições de estilo, alinhando a implementação técnica com as diretrizes visuais atualizadas. Isso inclui ajustes em componentes complexos de navegação e seleção de dados.

2. Automação e Ferramentas de Produtividade - Foi desenvolvido e implementado um sistema de automação focado no suporte e na atualização de registros internos (tickets), reduzindo o esforço manual da equipe. Paralelamente, o estagiário trabalhou na publicação e manutenção de ferramentas (plugins) que integram o software de design ao ambiente de desenvolvimento, facilitando a passagem de bastão entre designers e desenvolvedores.

3. Garantia de Qualidade (QA) - Houve uma atuação constante na correção de bugs em elementos de interface, especificamente em camadas de sobreposição (overlays) e seletores. Além disso, foi responsabilidade do estagiário manter a saúde dos testes automatizados (end-to-end), corrigindo falhas geradas pelas atualizações de interface e garantindo a estabilidade das versões de release.

4. Migração e Arquitetura (Fase Final) - Na etapa final do estágio (finais de dezembro e início de janeiro), o foco mudou para infraestrutura. O estagiário participou ativamente da migração do framework principal da aplicação para sua versão mais recente, lidando com ajustes de build e compatibilidade. Simultaneamente, trabalhou na exportação de componentes da versão web para funcionarem de forma independente (standalone) em contextos móveis, finalizando com a redação das especificações técnicas para essas novas implementações.`,
    conclusion:
      "O estágio permitiu vivenciar não apenas o desenvolvimento de funcionalidades (features), mas também o aspecto estrutural da engenharia de software, como migrações de versão e arquitetura de sistemas de design. A experiência de lidar com automação de processos e modularização de componentes móveis agregou conhecimentos valiosos sobre escalabilidade e manutenção de software a longo prazo. As metas estabelecidas foram cumpridas, entregando valor real à equipe através das ferramentas de automação e da modernização da base de código.",
  },
  evaluation: {
    grades: [
      {
        item: "Aquisição de Novas Experiências",
        grade: 10,
        observation:
          "Tive oportunidade de trabalhar com tecnologias com as quais não tinha familiaridade, como desenvolvimento de WebServices, APIs REST, Testes exploratórios em ambiente ágil.",
      },
      {
        item: "Acompanhamento do supervisor",
        grade: 10,
        observation:
          "O supervisor sempre esteve presente e disponível para solucionar problemas técnicos e/ou burocráticos enfrentados.",
      },
      {
        item: "Interação com colegas do Trabalho",
        grade: 10,
        observation:
          "Apesar da rotatividade de projetos e colegas, o ambiente sempre foi muito bom com todos (estagiários e funcionários) tentando ajudar a cumprir as metas estabelecidas para os projetos.",
      },
      {
        item: "Ambiente de Trabalho",
        grade: 10,
        observation:
          "O ambiente de trabalho é o melhor que se pode fazer diante de algumas deficiências físicas do prédio, como na época de chuvas em que foram alagadas algumas estações de trabalho e foi necessário um remanejamento de pessoas e computadores.",
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
