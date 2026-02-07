/**
 * Step 6 - Revisão de todos os dados
 */

import { Button } from '../../shared/components';
import { IInternshipData } from '../../shared/domain/types';
import { formatDatePtBr } from '../../shared/utils/dateUtils';

interface Step6Props {
  data: IInternshipData;
  onNext: () => void;
  onBack: () => void;
  onEdit: (step: number) => void;
}

export function Step6_ReviewStep({ data, onNext, onBack, onEdit }: Step6Props) {
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">Revisão dos Dados</h2>
        <p className="text-text-secondary dark:text-text-secondary-dark mt-1">
          Confira todas as informações antes de gerar os documentos.
        </p>
      </div>

      {/* Dados do Aluno */}
      <ReviewSection
        title="Dados do Aluno"
        step={1}
        onEdit={onEdit}
      >
        <ReviewItem label="Nome" value={data.student.fullName} />
        <ReviewItem label="E-mail" value={data.student.email} />
        <ReviewItem label="Telefone" value={data.student.phone} />
        <ReviewItem label="Endereço" value={data.student.address} />
        <ReviewItem label="Curso" value={data.student.course} />
        <ReviewItem label="Ano de Ingresso" value={data.student.enrollmentYear} />
        <ReviewItem label="Matrícula" value={data.student.studentId} />
      </ReviewSection>

      {/* Dados da Empresa */}
      <ReviewSection
        title="Dados da Empresa"
        step={2}
        onEdit={onEdit}
      >
        <ReviewItem label="Empresa" value={data.company.companyName} />
        <ReviewItem label="Endereço" value={data.company.companyAddress} />
        <ReviewItem label="CNPJ" value={data.company.companyCnpj} />
      </ReviewSection>

      {/* Informações do Estágio */}
      <ReviewSection
        title="Informações Gerais"
        step={3}
        onEdit={onEdit}
      >
        <ReviewItem 
          label="Período" 
          value={`${formatDatePtBr(data.general.startDate)} a ${formatDatePtBr(data.general.endDate)}`} 
        />
        <ReviewItem label="Carga Horária" value={`${data.general.hoursPerDay}h/dia`} />
        <ReviewItem label="Dias" value={data.general.workDays} />
        <ReviewItem label="Horário" value={data.general.workSchedule} />
        <ReviewItem label="Modalidade" value={data.general.modality} />
      </ReviewSection>

      {/* Conteúdo do Estágio */}
      <ReviewSection
        title="Conteúdo do Estágio"
        step={4}
        onEdit={onEdit}
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-2">Atividades</h4>
            <ul className="list-disc list-inside space-y-1">
              {data.content.activities.filter(Boolean).map((activity) => (
                <li key={`activity-${activity}`} className="text-sm text-text-primary dark:text-text-primary-dark">{activity}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-2">Objetivos</h4>
            <ul className="list-disc list-inside space-y-1">
              {data.content.objectives.filter(Boolean).map((objective) => (
                <li key={`objective-${objective}`} className="text-sm text-text-primary dark:text-text-primary-dark">{objective}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark mb-2">Cronograma</h4>
            <div className="space-y-2">
              {data.content.schedule.filter(item => item.period || item.description).map((item) => (
                <div key={`schedule-${item.period}-${item.description}`} className="bg-surface-elevated dark:bg-surface-elevated-dark rounded p-3 border border-border dark:border-border-dark">
                  <p className="text-xs font-medium text-cin-red">{item.period}</p>
                  <p className="text-sm text-text-primary dark:text-text-primary-dark mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ReviewSection>

      {/* Supervisão */}
      <ReviewSection
        title="Supervisão e Orientação"
        step={5}
        onEdit={onEdit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark mb-3">Supervisor</h4>
            <ReviewItem label="Nome" value={data.supervision.supervisorName} />
            <ReviewItem label="Cargo" value={data.supervision.supervisorPosition} />
            <ReviewItem label="E-mail" value={data.supervision.supervisorEmail} />
            <ReviewItem label="Telefone" value={data.supervision.supervisorPhone} />
            <ReviewItem label="CPF" value={data.supervision.supervisorCpf} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-primary dark:text-text-primary-dark mb-3">Professor Orientador</h4>
            <ReviewItem label="Nome" value={data.supervision.advisorName} />
            <ReviewItem label="Cargo" value={data.supervision.advisorPosition} />
            <ReviewItem label="E-mail" value={data.supervision.advisorEmail} />
            <ReviewItem label="SIAPE" value={data.supervision.advisorSiape} />
          </div>
        </div>
      </ReviewSection>

      <div className="flex justify-between pt-6 border-t border-border dark:border-border-dark">
        <Button type="button" variant="ghost" onClick={onBack}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Button>

        <Button onClick={onNext}>
          Continuar para Download
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

// Componentes auxiliares
interface ReviewSectionProps {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}

function ReviewSection({ title, step, onEdit, children }: ReviewSectionProps) {
  return (
    <section className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg p-6 border border-border dark:border-border-dark">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="text-cin-red hover:text-cin-dark text-sm font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {children}
      </div>
    </section>
  );
}

interface ReviewItemProps {
  label: string;
  value: string;
}

function ReviewItem({ label, value }: ReviewItemProps) {
  return (
    <div>
      <dt className="text-xs text-text-secondary dark:text-text-secondary-dark">{label}</dt>
      <dd className="text-sm text-text-primary dark:text-text-primary-dark font-medium">{value || '-'}</dd>
    </div>
  );
}
