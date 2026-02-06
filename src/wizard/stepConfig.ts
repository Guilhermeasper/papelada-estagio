/**
 * Wizard Step Configuration
 * Externalized from WizardContainer for better maintainability
 */

import { IStepInfo } from '../shared/domain/types';

export const STEPS: IStepInfo[] = [
  { step: 1, title: 'Checklist', description: 'Documentos necessários' },
  { step: 2, title: 'Dados do Aluno', description: 'Informações pessoais e acadêmicas' },
  { step: 3, title: 'Empresa', description: 'Dados da empresa concedente' },
  { step: 4, title: 'Info. Gerais', description: 'Período e carga horária' },
  { step: 5, title: 'Conteúdo', description: 'Atividades e objetivos' },
  { step: 6, title: 'Supervisão', description: 'Supervisor e orientador' },
  { step: 7, title: 'Revisão', description: 'Confirmar dados' },
  { step: 8, title: 'Download', description: 'Gerar documentos' },
];

export const TOTAL_STEPS = STEPS.length;
