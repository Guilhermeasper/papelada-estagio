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
          Para gerar os documentos do estágio CLT, você precisará das seguintes informações. Confira cada documento:
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. Plano de Atividades */}
        <div className="bg-white p-5 rounded-lg border border-cin-gray/20 shadow-sm">
          <h3 className="font-bold text-lg text-cin-black mb-3">📋 Plano de Atividades (Modelo CIn)</h3>
          <p className="text-sm text-cin-black/60 mb-3">Documento de formalização inicial do estágio</p>
          <ul className="list-disc pl-5 space-y-1 text-cin-black/80 text-sm">
            <li><strong>Dados do Estagiário:</strong> Nome, E-mail, Endereço, Telefone, Curso, Ano de Ingresso, Matrícula</li>
            <li><strong>Identificação da Empresa:</strong> Razão Social, Endereço, CNPJ</li>
            <li><strong>Programa de Estágio:</strong> Período (Início/Fim), Carga Horária diária, Dias da semana, Horário, Modalidade</li>
            <li><strong>Conteúdo Técnico:</strong> Lista de atividades, Objetivos/metas, Cronograma detalhado</li>
            <li><strong>Supervisão:</strong> Dados do Supervisor (empresa) e do Professor Orientador (CIn)</li>
            <li><strong>Critérios de Avaliação:</strong> Data do parecer, Pesos (Assiduidade, Comprometimento, Independência, etc.)</li>
          </ul>
        </div>

        {/* 2. Declaração da Empresa */}
        <div className="bg-white p-5 rounded-lg border border-cin-gray/20 shadow-sm">
          <h3 className="font-bold text-lg text-cin-black mb-3">📄 Declaração da Empresa (Vínculo CLT)</h3>
          <p className="text-sm text-cin-black/60 mb-3">Substitui o TCE para alunos com contrato CLT</p>
          <ul className="list-disc pl-5 space-y-1 text-cin-black/80 text-sm">
            <li><strong>Identificação do Vínculo:</strong> Nome do aluno, Matrícula, Regime CLT, Cargo, Data de início</li>
            <li><strong>Carga Horária:</strong> CH semanal (ex: 40 horas)</li>
            <li><strong>Atividades:</strong> Lista de tarefas técnicas com correlação a Ciência da Computação</li>
            <li><strong>Cláusula de Compatibilidade:</strong> Declaração de compatibilidade com o Projeto Pedagógico</li>
            <li><strong>Assinatura do Supervisor:</strong> Nome completo, Cargo, Data</li>
          </ul>
        </div>

        {/* 3. Cópia da CTPS */}
        <div className="bg-white p-5 rounded-lg border border-cin-gray/20 shadow-sm">
          <h3 className="font-bold text-lg text-cin-black mb-3">🪪 Cópia da Carteira de Trabalho (CTPS)</h3>
          <p className="text-sm text-cin-black/60 mb-3">Documento probatório exigido pela resolução</p>
          <ul className="list-disc pl-5 space-y-1 text-cin-black/80 text-sm">
            <li>Página com foto e dados de identificação do portador</li>
            <li>Página do contrato de trabalho com dados da empresa e data de admissão</li>
          </ul>
        </div>

        {/* 4. Relatório Final */}
        <div className="bg-white p-5 rounded-lg border border-cin-gray/20 shadow-sm">
          <h3 className="font-bold text-lg text-cin-black mb-3">📑 Relatório Final de Estágio</h3>
          <p className="text-sm text-cin-black/60 mb-3">Relatório detalhado para conclusão da disciplina</p>
          <ul className="list-disc pl-5 space-y-1 text-cin-black/80 text-sm">
            <li><strong>Capa:</strong> UFPE, CIn, Título, Curso, Local, Mês/Ano</li>
            <li><strong>Identificação:</strong> Nome, Semestre, Empresa, Supervisor, Datas, CH, Orientador</li>
            <li><strong>Corpo do Texto:</strong> Índice, Introdução, Objetivos (Gerais/Específicos), Cronograma, Metodologia, Desenvolvimento, Conclusão</li>
            <li><strong>Autoavaliação:</strong> Notas (0-10) para Aquisição de Experiências, Acompanhamento, Interação, Ambiente</li>
            <li><strong>Questionário da Concedente:</strong> Flexibilidade, Redução em provas, Preocupação acadêmica, Convênio</li>
          </ul>
        </div>

        {/* 5. Avaliação do Orientador */}
        <div className="bg-white p-5 rounded-lg border border-cin-gray/20 shadow-sm">
          <h3 className="font-bold text-lg text-cin-black mb-3">👨‍🏫 Avaliação pelo Professor Orientador</h3>
          <p className="text-sm text-cin-black/60 mb-3">Parecer e nota emitidos pelo orientador do CIn</p>
          <ul className="list-disc pl-5 space-y-1 text-cin-black/80 text-sm">
            <li><strong>Identificação:</strong> Nome do aluno, Curso, Empresa, Período, Orientador</li>
            <li><strong>Tabela de Desempenho:</strong> Comunicação, Assiduidade, Cooperação, Independência, Conhecimento, Desempenho Geral</li>
            <li><strong>Parecer e Nota:</strong> Texto detalhado e nota final (0-10)</li>
          </ul>
        </div>

        {/* 6. Avaliação do Supervisor */}
        <div className="bg-white p-5 rounded-lg border border-cin-gray/20 shadow-sm">
          <h3 className="font-bold text-lg text-cin-black mb-3">👔 Avaliação pelo Supervisor</h3>
          <p className="text-sm text-cin-black/60 mb-3">Parecer e nota emitidos pelo supervisor da empresa</p>
          <ul className="list-disc pl-5 space-y-1 text-cin-black/80 text-sm">
            <li><strong>Identificação:</strong> Nome do aluno, Curso, Empresa, Período, Supervisor</li>
            <li><strong>Tabela de Desempenho:</strong> Comunicação, Assiduidade, Cooperação, Independência, Conhecimento, Desempenho Geral</li>
            <li><strong>Parecer e Nota:</strong> Texto com elogios/pontos de melhoria e nota final (0-10)</li>
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
