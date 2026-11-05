# Papelada Estágio

Gerador de documentos de estágio obrigatório do CIn/UFPE. Um formulário de 8 passos
coleta os dados e gera PDFs a partir dos modelos oficiais:

- Plano de Atividades
- Relatório de Estágio
- Avaliação do Professor Orientador
- Avaliação do Supervisor

O app cobre todos os casos do estágio obrigatório: CLT, servidor público,
sócio-administrador e estágio com Termo de Compromisso (TCE). A carga horária e os
documentos dependem do curso, do perfil curricular e do regime, informados no
passo 1. Ciência da Computação no perfil novo e Inteligência Artificial não têm
estágio obrigatório.

Os documentos externos, como o TCE, a declaração da empresa e a cópia da CTPS,
**não** são gerados aqui. Eles vêm da empresa e do próprio aluno.

## Escopo: só a preparação dos documentos

O processo da SecGrad inclui etapas antes e depois da geração dos PDFs.
O app cobre a preparação dos documentos e descreve as demais etapas nos passos
1 e 8. Para entregar os documentos:

> Colha todas as assinaturas **exceto a da coordenação**, entregue à Secretaria
> da Graduação para conferência, e é a SecGrad quem encaminha o documento à
> Coordenação de Estágio para a assinatura final.

O rodapé do Plano de Atividades reproduz o texto do formulário oficial. Ele diz
que o documento deve conter "obrigatoriamente, todas as assinaturas". Isso
descreve o documento pronto, não a ordem das assinaturas.

Comece o processo com **3 semanas de antecedência**. A documentação precisa chegar
à SecGrad com no mínimo **8 dias úteis de antecedência**, e a vigência não pode ser
retroativa.

## Fonte das regras

<https://secgrad.cin.ufpe.br/estágio>

As regras deste app vêm da Lei 11.788/2008, da Resolução CEPE 20/2015, da IN
PROGRAD 1/2026 e do site da SecGrad. Elas podem desatualizar. Em caso de divergência,
**o site prevalece**. O documento [regras de estágio](./docs/regras-de-estagio.md)
liga cada regra à sua fonte, ao código e ao teste.

## Desenvolvimento

```bash
npm install
npm run dev       # servidor local
npm test
npm run check     # formatação, lint, tipos e testes
npm run build
npm run pdf:check # renderiza os PDFs e checa o layout (precisa do Poppler)
```

Para contribuir, leia o [guia de contribuição](./CONTRIBUTING.md) e as
[convenções de código](./CODING_STANDARDS.md).

Stack: React 19, TypeScript, Vite, Tailwind 4, react-hook-form + Zod,
@react-pdf/renderer.

### Estrutura

| Caminho                            | Conteúdo                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `src/wizard/steps/`                | Os 8 passos do formulário                                                 |
| `src/wizard/data/`                 | Checklist de documentos e etapas do processo                              |
| `src/documents/`                   | Um diretório por documento gerado (metadata + definição + componente PDF) |
| `src/components/pdf/`              | Primitivas de layout de PDF compartilhadas                                |
| `src/constants/internshipRules.ts` | Regras por curso, perfil curricular e regime                              |
| `src/constants/pdf-content.ts`     | Textos oficiais dos formulários                                           |
| `scripts/`                         | Renderização de PDFs e verificação de layout fora do browser              |

Os documentos são registrados em `src/config/documentRegistry.ts` e carregados
sob demanda. Para adicionar um documento novo, crie o diretório em
`src/documents/` e registre-o ali.
