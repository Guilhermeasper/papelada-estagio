/**
 * Step 0 - Checklist Inicial
 */

import { Button } from '../../shared/components';

interface Step0Props {
  onNext: () => void;
}

export function Step0_Checklist({ onNext }: Step0Props) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cin-black">Antes de começar</h2>
        <p className="text-cin-black/60 mt-1">
          Para gerar os documentos do estágio, você precisará das seguintes informações em mãos:
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-cin-gray/20 shadow-sm">
          <h3 className="font-bold text-lg text-cin-black mb-4">📝 Dados do Estudante</h3>
          <ul className="list-disc pl-5 space-y-2 text-cin-black/80">
            <li>Dados pessoais (Nome, CPF, RG, Endereço completo)</li>
            <li>Dados acadêmicos (Matrícula, Curso, Semestre/Ano de ingresso)</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border border-cin-gray/20 shadow-sm">
          <h3 className="font-bold text-lg text-cin-black mb-4">🏢 Dados da Empresa</h3>
          <ul className="list-disc pl-5 space-y-2 text-cin-black/80">
            <li>Razão Social e CNPJ</li>
            <li>Endereço completo da sede do estágio</li>
            <li>Nome e cargo do Representante Legal (quem assina pela empresa)</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border border-cin-gray/20 shadow-sm">
          <h3 className="font-bold text-lg text-cin-black mb-4">👥 Supervisão e Orientação</h3>
          <ul className="list-disc pl-5 space-y-2 text-cin-black/80">
            <li><strong>Supervisor (na Empresa):</strong> Nome completo, Cargo, Formação acadêmica e Registro profissional (se houver)</li>
            <li><strong>Orientador (no CIn-UFPE):</strong> Nome do professor orientador</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border border-cin-gray/20 shadow-sm">
          <h3 className="font-bold text-lg text-cin-black mb-4">📅 Detalhes do Estágio</h3>
          <ul className="list-disc pl-5 space-y-2 text-cin-black/80">
            <li>Data de início e término previstos</li>
            <li>Horário de trabalho e carga horária semanal</li>
            <li>Valor da bolsa e benefícios (se houver)</li>
            <li>Plano de atividades detalhado</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-cin-gray mt-8">
        <Button onClick={onNext}>
          Tenho tudo em mãos
          <svg
            className="w-4 h-4 ml-2"
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
    </div>
  );
}
