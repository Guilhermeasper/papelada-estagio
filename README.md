# Papelada Estágio

Gerador de documentos de estágio obrigatório do CIn/UFPE. Um wizard de 8 passos
coleta os dados uma única vez e produz os PDFs no formato dos modelos oficiais:

- Plano de Atividades
- Relatório de Estágio
- Avaliação do Professor Orientador
- Avaliação do Supervisor

A "Declaração da Empresa (Vínculo CLT)" e a cópia da CTPS **não** são geradas
aqui — vêm da empresa e do próprio aluno.

## Escopo: só a preparação dos documentos

O processo oficial da SecGrad tem etapas antes e depois da geração dos PDFs.
Este app cobre apenas "preparar a documentação". As demais etapas estão descritas
dentro do próprio wizard (passo 1 e passo 8), e o ponto crítico é este:

> Colha todas as assinaturas **exceto a da coordenação**, entregue à Secretaria
> da Graduação para conferência, e é a SecGrad quem encaminha o documento à
> Coordenação de Estágio para a assinatura final.

O rodapé do Plano de Atividades — texto do formulário oficial, reproduzido sem
alteração — diz que o documento deve conter "obrigatoriamente, todas as
assinaturas". Isso descreve o documento pronto, não a ordem em que assiná-lo.

Comece o processo com **3 semanas de antecedência**.

## Fonte das regras

<https://secgrad.cin.ufpe.br/perguntas-frequentes>

O checklist e as regras deste app são derivados do site da SecGrad e podem
desatualizar. Em caso de divergência, **o site prevalece**.

## Desenvolvimento

```bash
npm install
npm run dev       # servidor local
npm run lint
npm run build
npm run pdf:check # renderiza os PDFs e checa o layout
```

Stack: React 19, TypeScript, Vite, Tailwind 4, react-hook-form + Zod,
@react-pdf/renderer.

### Estrutura

| Caminho                        | Conteúdo                                                                  |
| ------------------------------ | ------------------------------------------------------------------------- |
| `src/wizard/steps/`            | Os 8 passos do formulário                                                 |
| `src/wizard/data/`             | Checklist de documentos e etapas do processo                              |
| `src/documents/`               | Um diretório por documento gerado (metadata + definição + componente PDF) |
| `src/components/pdf/`          | Primitivas de layout de PDF compartilhadas                                |
| `src/constants/pdf-content.ts` | Textos oficiais dos formulários                                           |
| `scripts/`                     | Renderização de PDFs e verificação de layout fora do browser              |

Os documentos são registrados em `src/config/documentRegistry.ts` e carregados
sob demanda. Para adicionar um documento novo, crie o diretório em
`src/documents/` e registre-o ali.
