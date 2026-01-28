/**
 * Wizard Step Configuration
 * Externalized from WizardContainer for better maintainability
 */

import { IStepInfo } from '../shared/domain/types';

export const STEPS: IStepInfo[] = [
  { step: 1, title: 'Dados do Aluno', description: 'Informações pessoais e acadêmicas' },
  { step: 2, title: 'Empresa', description: 'Dados da empresa concedente' },
  { step: 3, title: 'Info. Gerais', description: 'Período e carga horária' },
  { step: 4, title: 'Conteúdo', description: 'Atividades e objetivos' },
  { step: 5, title: 'Supervisão', description: 'Supervisor e orientador' },
  { step: 6, title: 'Revisão', description: 'Confirmar dados' },
  { step: 7, title: 'Download', description: 'Gerar documentos' },
];

export const TOTAL_STEPS = STEPS.length;
