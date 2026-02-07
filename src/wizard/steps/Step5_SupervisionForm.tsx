/**
 * Step 5 - Supervisão e Orientação
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../../shared/components';
import { ISupervisionData } from '../../shared/domain/types';
import { SupervisionFormData, supervisionSchema } from '../schemas/validationSchemas';

interface Step5Props {
  data: ISupervisionData;
  onNext: (data: ISupervisionData) => void;
  onBack: () => void;
}

export function Step5_SupervisionForm({ data, onNext, onBack }: Step5Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SupervisionFormData>({
    resolver: zodResolver(supervisionSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: SupervisionFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">Supervisão e Orientação</h2>
        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-1">
          Dados do supervisor da empresa e do professor orientador.
        </p>
      </div>

      {/* Supervisor da Empresa */}
      <section className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg p-6 border border-border dark:border-border-dark">
        <h3 className="text-base md:text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-cin-red" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          Supervisor da Empresa
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nome Completo"
            placeholder="Nome do supervisor"
            {...register('supervisorName')}
            error={errors.supervisorName?.message}
            required
          />

          <Input
            label="Cargo"
            placeholder="Ex: Team Lead"
            {...register('supervisorPosition')}
            error={errors.supervisorPosition?.message}
            required
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="email@empresa.com"
            {...register('supervisorEmail')}
            error={errors.supervisorEmail?.message}
            required
          />

          <Input
            label="Telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            {...register('supervisorPhone')}
            error={errors.supervisorPhone?.message}
            required
          />

          <Input
            label="CPF"
            placeholder="000.000.000-00"
            {...register('supervisorCpf')}
            error={errors.supervisorCpf?.message}
            required
          />
        </div>
      </section>

      {/* Professor Orientador */}
      <section className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg p-6 border border-border dark:border-border-dark">
        <h3 className="text-base md:text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-cin-red" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          Professor Orientador
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nome Completo"
            placeholder="Nome do professor"
            {...register('advisorName')}
            error={errors.advisorName?.message}
            required
          />

          <Input
            label="Cargo"
            placeholder="Ex: Professor Adjunto I"
            {...register('advisorPosition')}
            error={errors.advisorPosition?.message}
            required
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="email@cin.ufpe.br"
            {...register('advisorEmail')}
            error={errors.advisorEmail?.message}
            required
          />

          <Input
            label="SIAPE"
            placeholder="Matrícula SIAPE"
            {...register('advisorSiape')}
            error={errors.advisorSiape?.message}
            required
          />
        </div>
      </section>

      <div className="flex justify-between pt-6 border-t border-border dark:border-border-dark">
        <Button type="button" variant="ghost" onClick={onBack}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Button>

        <Button type="submit" isLoading={isSubmitting}>
          Próximo
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </form>
  );
}
