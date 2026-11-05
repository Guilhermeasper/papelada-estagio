# Regras de estágio aplicadas pelo app

Este documento liga cada regra do app à norma de origem, ao código e ao teste. Use-o para conferir se o app continua de acordo com as normas e para saber o que mudar quando uma norma mudar.

**Última conferência das fontes:** 04/11/2026.

Em caso de divergência, o [site da SecGrad](https://secgrad.cin.ufpe.br/estágio) prevalece sobre o app.

## Fontes

Quando as fontes divergem, o app segue esta ordem:

1. [Lei 11.788/2008](https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2008/lei/l11788.htm), com as alterações da Lei 14.913/2024.
2. [Resolução CEPE/UFPE 20/2015 consolidada](https://www.ufpe.br/documents/38970/2576689/Resolu%C3%A7%C3%A3o+20.2015_Alterada+pelas+09.2016%2C+09.2018+e+02.2020_corrigida.pdf/6d3906a6-1429-4b29-9dea-05f351b3b074) e [IN PROGRAD/UFPE 1/2026](https://www.ufpe.br/documents/38970/7340164/IN12026+-+estagio.pdf/9722a281-bd06-42dd-8065-ef7afc1d91d3).
3. [Página de estágio da SecGrad](https://secgrad.cin.ufpe.br/estágio), que publica os regulamentos de cada curso, o fluxograma e os modelos dos documentos.

## Carga horária por curso e perfil

A tabela fica em `MANDATORY_INTERNSHIP_RULES`, em `src/constants/internshipRules.ts`. O teste é `src/constants/internshipRules.test.ts`.

| Curso                    | Perfil anterior                                | Perfil novo (0001-2024.1)   |
| ------------------------ | ---------------------------------------------- | --------------------------- |
| Ciência da Computação    | 300h. Todas as obrigatórias, exceto TG (1905h) | Sem estágio obrigatório     |
| Engenharia da Computação | 300h. 63% da carga de disciplinas              | 180h. 53% da carga          |
| Sistemas de Informação   | Informada pelo aluno. 900h de obrigatórias     | 75h. Créditos de 3 períodos |
| Inteligência Artificial  | Sem estágio obrigatório                        | Sem estágio obrigatório     |

## Regras por regime

A tabela fica em `REGIME_RULES`, no mesmo arquivo. O texto do checklist fica em `checklist.regimes`, em `src/locales/pt-BR.json`.

| Regime   | Máx. por dia | Supervisor | Documentos externos                           | Fonte                                     |
| -------- | ------------ | ---------- | --------------------------------------------- | ----------------------------------------- |
| CLT      | 8h           | Sim        | Declaração da empresa e registro na CTPS      | Res. 20/2015, art. 2º, § 3º, I; SecGrad   |
| Servidor | 8h           | Sim        | Declaração do órgão e ato de nomeação         | Res. 20/2015, art. 2º, § 3º, II; SecGrad  |
| Sócio    | 8h           | Não        | Contrato social registrado na Junta Comercial | Res. 20/2015, art. 2º, § 3º, III; SecGrad |
| TCE      | 6h           | Sim        | TCE, convênio e seguro                        | Lei, art. 10; Res. 20/2015, arts. 6º e 18 |

O limite semanal não tem checagem própria. O app aceita no máximo 5 dias por semana, então os limites diários já garantem 40h e 30h.

## Prazos e validações

| Regra                                                     | Fonte                                       | Código                                      |
| --------------------------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| Vigência do Plano não pode ser retroativa                 | SecGrad                                     | `getPhaseStatus` em `documentStatus.ts`     |
| Documentação inicial com 8 dias úteis de antecedência     | SecGrad                                     | `getSubmissionTimeline` em `dateCalculator` |
| Começar o processo 3 semanas antes                        | Fluxograma da SecGrad                       | `getSubmissionTimeline`                     |
| Seguro da UFPE: documentação até o dia 15 do mês anterior | SecGrad; IN 1/2026, art. 12                 | `getSubmissionTimeline`                     |
| Estágio de até 2 anos na mesma concedente (aviso)         | Lei, art. 11                                | `exceedsMaxDuration`                        |
| Documentos finais só depois do encerramento (aviso)       | SecGrad                                     | `getPhaseStatus`                            |
| Supervisor e orientador são pessoas distintas             | FAQ da UFPE, item 17; Res. 20/2015, art. 20 | `makeSupervisionSchema`                     |
| Parecer e Termo de Cumprimento de Metas em ordem          | Modelo do Plano                             | `makeSupervisionSchema`                     |
| Jornada contínua só até 6h                                | CLT, art. 71                                | `isValidWorkSchedule` em `workSchedule`     |
| CNPJ alfanumérico                                         | Receita Federal, desde 31/07/2026           | `cnpjSchema` e `maskCnpj`                   |
| 20/11, 16/07 e 08/12 são feriados                         | Lei 14.759/2023; calendário de Recife       | `holidays.ts`                               |

Os testes ficam ao lado de cada arquivo, em `*.test.ts`.

### Validação por documento

`getDocumentStatus`, em `src/wizard/schemas/documentStatus.ts`, decide o que cada documento exige:

- **Plano de Atividades:** valida o período, as horas do curso e o calendário, porque é o documento que formaliza a vigência.
- **Relatório:** exige os textos do relatório e todas as respostas da avaliação do aluno. Nenhuma resposta vem preenchida.
- **Avaliações:** exigem só os dados de identificação. A avaliação do supervisor não existe para sócio-administrador.

Os documentos finais não revalidam o calendário. O calendário do app é uma estimativa, e um feriado adicionado depois não pode invalidar uma vigência que a SecGrad já aceitou.

## Modelos oficiais

Os textos ficam em `src/locales/pt-BR.json`, na chave `pdf`, e são lidos por `src/constants/pdf-content.ts`. Foram comparados com os modelos publicados pela SecGrad:

| Documento  | Conferido com                                                           |
| ---------- | ----------------------------------------------------------------------- |
| Plano      | Modelo do Plano Não Obrigatório. O do Obrigatório exige login no Google |
| Relatório  | Modelo do Relatório Final                                               |
| Avaliações | Modelos da Avaliação do Orientador e do Supervisor                      |

O cabeçalho "PRÓ-REITORIA PARA ASSUNTOS ACADÊMICOS" é o nome antigo da PROGRAD, mas é o que o modelo oficial usa. Por isso continua no Plano.

## Pendências para confirmar com a SecGrad

Nenhuma destas pendências impede o uso do app. A coluna "O app hoje" diz o que foi adotado.

| Dúvida                                                                                          | O app hoje                                     |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| O regulamento de SI do perfil anterior exige login. Qual é a carga horária?                     | O aluno informa o valor no passo 1             |
| O modelo do Plano Obrigatório exige login. Ele é igual ao Não Obrigatório?                      | Segue o Não Obrigatório                        |
| A Res. 20/2015, art. 2º, § 3º, fala em requerimento à Coordenação. O fluxo da SecGrad não.      | Segue a SecGrad, sem requerimento separado     |
| A IN 1/2026, art. 12, § 1º, inclui todo estágio obrigatório no seguro. A SecGrad é condicional. | Informa o prazo como condicional               |
| O regulamento de EC anterior (art. 20) exige convênio com vínculo. Res. e SecGrad dispensam.    | Segue a Resolução e a SecGrad, sem convênio    |
| As fontes divergem sobre 12/03 ser feriado em Recife.                                           | Mantém como feriado, o que só alonga o término |

## Limitações conhecidas

- A CLT prevê 15 minutos de intervalo em jornadas de 4h a 6h (art. 71, § 1º). A grade de horários usa passos de 30 minutos e não representa esse intervalo.
- Carnaval e Corpus Christi são pontos facultativos, mas o app os conta como dias sem trabalho. Isso só alonga a data de término sugerida, que o aluno pode editar.
- O app não gera TCE, termo aditivo nem rescisão. Os modelos são da empresa, do agente de integração ou da PROGRAD.
- O app não valida trabalho aos sábados e exige no mínimo 2h por dia. Nenhuma norma trata desses pontos.

## Quando conferir de novo

- **Ao início de cada ano letivo.** A IN 1/2026 vale só para o ano letivo de 2026.
- **Quando o Congresso votar o Veto 22/2026.** O PL 2.762/2019, sobre estágio como experiência profissional, foi vetado, e o veto aguarda apreciação.
- **Quando um colegiado publicar novo regulamento de curso.**
