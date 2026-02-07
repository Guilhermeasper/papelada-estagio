/**
 * Step 4 - Conteúdo do Estágio
 * Atividades, objetivos, cronograma e textos do relatório
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button, DynamicList, TextArea } from '../../shared/components';
import { IInternshipContent } from '../../shared/domain/types';
import { InternshipContentFormData, internshipContentSchema } from '../schemas/validationSchemas';

interface Step4Props {
  data: IInternshipContent;
  onNext: (data: IInternshipContent) => void;
  onBack: () => void;
}

export function Step4_InternshipContent({ data, onNext, onBack }: Step4Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InternshipContentFormData>({
    resolver: zodResolver(internshipContentSchema),
    defaultValues: {
      ...data,
      activities: data.activities.length > 0 ? data.activities : [''],
      objectives: data.objectives.length > 0 ? data.objectives : [''],
      schedule: data.schedule.length > 0 ? data.schedule : [{ period: '', description: '' }],
    },
  });

  // Field arrays para listas dinâmicas
  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } = useFieldArray({
    control,
    name: 'schedule',
  });

  const activities = watch('activities');
  const objectives = watch('objectives');

  // Handlers para atividades
  const handleAddActivity = () => {
    setValue('activities', [...activities, '']);
  };

  const handleRemoveActivity = (index: number) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setValue('activities', newActivities);
  };

  const handleChangeActivity = (index: number, value: string) => {
    const newActivities = [...activities];
    newActivities[index] = value;
    setValue('activities', newActivities);
  };

  // Handlers para objetivos
  const handleAddObjective = () => {
    setValue('objectives', [...objectives, '']);
  };

  const handleRemoveObjective = (index: number) => {
    const newObjectives = objectives.filter((_, i) => i !== index);
    setValue('objectives', newObjectives);
  };

  const handleChangeObjective = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setValue('objectives', newObjectives);
  };

  const onSubmit = (formData: InternshipContentFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">Conteúdo do Estágio</h2>
        <p className="text-text-secondary dark:text-text-secondary-dark mt-1">
          Descreva as atividades, objetivos e detalhes do seu estágio.
        </p>
      </div>

      {/* Atividades */}
      <section className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg p-6 border border-border dark:border-border-dark">
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">
          Atividades a serem desenvolvidas
        </h3>
        <DynamicList
          label="Atividades"
          items={activities}
          onAdd={handleAddActivity}
          onRemove={handleRemoveActivity}
          onChange={handleChangeActivity}
          placeholder="Descreva uma atividade..."
          error={errors.activities?.message || errors.activities?.root?.message}
        />
      </section>

      {/* Objetivos */}
      <section className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg p-6 border border-border dark:border-border-dark">
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">
          Objetivos / Metas a serem atingidas
        </h3>
        <DynamicList
          label="Objetivos"
          items={objectives}
          onAdd={handleAddObjective}
          onRemove={handleRemoveObjective}
          onChange={handleChangeObjective}
          placeholder="Descreva um objetivo..."
          error={errors.objectives?.message || errors.objectives?.root?.message}
        />
      </section>

      {/* Cronograma */}
      <section className="bg-surface-elevated dark:bg-surface-elevated-dark rounded-lg p-6 border border-border dark:border-border-dark">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">Cronograma</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendSchedule({ period: '', description: '' })}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Adicionar período
          </Button>
        </div>

        <div className="space-y-4">
          {scheduleFields.map((field, index) => (
            <div key={field.id} className="bg-surface dark:bg-surface-dark rounded-md p-4 border border-border dark:border-border-dark">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
                  Período {index + 1}
                </span>
                {scheduleFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="text-cin-red hover:text-cin-dark text-sm"
                  >
                    Remover
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                <input
                  {...register(`schedule.${index}.period`)}
                  placeholder="Ex: 20/11/2025 a 30/11/2025"
                  className="w-full px-4 py-2 border border-border dark:border-border-dark rounded-md bg-surface-elevated dark:bg-surface-elevated-dark text-text-primary dark:text-text-primary-dark focus:border-cin-red focus:ring-2 focus:ring-cin-red/20"
                />
                {errors.schedule?.[index]?.period && (
                  <p className="text-xs text-cin-red">{errors.schedule[index]?.period?.message}</p>
                )}
                
                <textarea
                  {...register(`schedule.${index}.description`)}
                  placeholder="Descrição das atividades do período..."
                  rows={3}
                  className="w-full px-4 py-2 border border-border dark:border-border-dark rounded-md bg-surface-elevated dark:bg-surface-elevated-dark text-text-primary dark:text-text-primary-dark focus:border-cin-red focus:ring-2 focus:ring-cin-red/20 resize-y"
                />
                {errors.schedule?.[index]?.description && (
                  <p className="text-xs text-cin-red">{errors.schedule[index]?.description?.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Textos do Relatório */}
      <section className="space-y-6">
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Conteúdo do Relatório
        </h3>

        <TextArea
          label="Introdução"
          {...register('introduction')}
          error={errors.introduction?.message}
          placeholder="Apresentação do estágio, empresa e objetivos..."
          rows={5}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextArea
            label="Objetivos Gerais"
            {...register('generalObjectives')}
            error={errors.generalObjectives?.message}
            placeholder="O objetivo geral do estágio foi..."
            rows={4}
            required
          />

          <TextArea
            label="Objetivos Específicos"
            {...register('specificObjectives')}
            error={errors.specificObjectives?.message}
            placeholder="Os objetivos específicos incluíram..."
            rows={4}
            required
          />
        </div>

        <TextArea
          label="Material e Método"
          {...register('methodology')}
          error={errors.methodology?.message}
          placeholder="Tecnologias, metodologias e ferramentas utilizadas..."
          rows={4}
          required
        />

        <TextArea
          label="Desenvolvimento"
          {...register('development')}
          error={errors.development?.message}
          placeholder="Descrição detalhada das atividades realizadas..."
          rows={6}
          required
        />

        <TextArea
          label="Conclusão"
          {...register('conclusion')}
          error={errors.conclusion?.message}
          placeholder="Considerações finais sobre o estágio..."
          rows={4}
          required
        />
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
