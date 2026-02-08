import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../../../components';
import { StudentFormData, studentSchema } from '../schemas/validationSchemas';
import type { IStep2Props } from '../step-types';

export function StudentFormStep({ data, onNext }: IStep2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: StudentFormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-primary-dark">Dados do Aluno</h2>
        <p className="text-sm md:text-base text-text-secondary dark:text-text-secondary-dark mt-1">
          Preencha suas informações pessoais e acadêmicas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Nome Completo"
            placeholder="Seu nome completo"
            {...register('fullName')}
            error={errors.fullName?.message}
            required
          />
        </div>

        <Input
          label="E-mail"
          type="email"
          placeholder="seu.email@exemplo.com"
          {...register('email')}
          error={errors.email?.message}
          required
        />

        <Input
          label="Telefone"
          type="tel"
          placeholder="(00) 00000-0000"
          {...register('phone')}
          error={errors.phone?.message}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Endereço"
            placeholder="Rua, número, bairro, cidade - UF"
            {...register('address')}
            error={errors.address?.message}
            required
          />
        </div>

        <Input
          label="Curso"
          placeholder="Ex: Ciência da Computação"
          {...register('course')}
          error={errors.course?.message}
          required
        />

        <Input
          label="Ano de Ingresso"
          placeholder="Ex: 2018.2"
          {...register('enrollmentYear')}
          error={errors.enrollmentYear?.message}
          hint="Formato: AAAA.S (ano.semestre)"
          required
        />

        <Input
          label="Matrícula"
          placeholder="Sua matrícula"
          {...register('studentId')}
          error={errors.studentId?.message}
          required
        />
      </div>

      <div className="flex justify-end pt-6 border-t border-border dark:border-border-dark">
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
