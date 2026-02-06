/**
 * Wizard Step Configuration
 * Externalized from WizardContainer for better maintainability
 */

import { IStepInfo } from '../shared/domain/types';

export const STEPS: IStepInfo[] = [
  { 
    step: 1, 
    title: 'Checklist', 
    description: 'Documentos necessários',
    requirements: [
      'Verificar documentos necessários',
      'Preparar informações do estágio',
    ]
  },
  { 
    step: 2, 
    title: 'Dados do Aluno', 
    description: 'Informações pessoais e acadêmicas',
    requirements: [
      'Nome completo',
      'E-mail institucional',
      'Endereço e telefone',
      'Curso e matrícula',
    ]
  },
  { 
    step: 3, 
    title: 'Empresa', 
    description: 'Dados da empresa concedente',
    requirements: [
      'Razão social da empresa',
      'Endereço completo',
      'CNPJ',
    ]
  },
  { 
    step: 4, 
    title: 'Info. Gerais', 
    description: 'Período e carga horária',
    requirements: [
      'Data de início e término',
      'Carga horária diária',
      'Horário de trabalho',
      'Modalidade (remoto/presencial)',
    ]
  },
  { 
    step: 5, 
    title: 'Conteúdo', 
    description: 'Atividades e objetivos',
    requirements: [
      'Atividades a serem desenvolvidas',
      'Objetivos do estágio',
      'Cronograma de atividades',
    ]
  },
  { 
    step: 6, 
    title: 'Supervisão', 
    description: 'Supervisor e orientador',
    requirements: [
      'Dados do supervisor (empresa)',
      'Dados do orientador (UFPE)',
    ]
  },
  { 
    step: 7, 
    title: 'Revisão', 
    description: 'Confirmar dados',
    requirements: [
      'Revisar todas as informações',
      'Corrigir dados se necessário',
    ]
  },
  { 
    step: 8, 
    title: 'Download', 
    description: 'Gerar documentos',
    requirements: [
      'Baixar documentos gerados',
      'Verificar formatação',
    ]
  },
];

export const TOTAL_STEPS = STEPS.length;
