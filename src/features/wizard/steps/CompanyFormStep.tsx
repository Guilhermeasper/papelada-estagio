import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../../../shared/components';
import { CompanyFormData, companySchema } from '../schemas/validationSchemas';
import type { IStep3Props } from '../step-types';

export function CompanyFormStep({ data, onNext, onBack }: IStep3Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: data,
  });

  const onSubmit = (formData: CompanyFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">Dados da Empresa</h2>
        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-1">
          Informações da empresa concedente do estágio.
        </p>
      </div>

      <div className="space-y-6">
        <Input
          label="Nome da Empresa"
          placeholder="Nome completo da empresa"
          {...register('companyName')}
          error={errors.companyName?.message}
          required
        />

        <Input
          label="Endereço da Empresa"
          placeholder="Rua, número, bairro, cidade - UF"
          {...register('companyAddress')}
          error={errors.companyAddress?.message}
          required
        />

        <Input
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          {...register('companyCnpj')}
          error={errors.companyCnpj?.message}
          required
        />
      </div>

      <div className="flex justify-between pt-6 border-t border-border dark:border-border-dark">
        <Button type="button" variant="ghost" onClick={onBack}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar
        </Button>

        <Button type="submit" isLoading={isSubmitting}>
          Próximo
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>
    </form>
  );
}
