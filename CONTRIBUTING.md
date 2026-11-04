# Como contribuir

Este guia mostra como preparar o ambiente, fazer uma mudança e abrir um pull request.

## Prepare o ambiente

1. Instale o Node.js na versão indicada em `.nvmrc`. Com o nvm, rode `nvm install`.
2. Faça um fork do repositório no GitHub.
3. Clone o fork e instale as dependências:

   ```bash
   git clone git@github.com:<seu-usuario>/papelada-estagio.git
   cd papelada-estagio
   npm install
   ```

   O `npm install` também ativa o hook de pré-commit.

## Faça a mudança

1. Crie uma branch a partir de `main`, com um prefixo que diga o tipo da mudança:

   ```bash
   git checkout -b feat/nome-da-mudanca
   ```

2. Rode o app com `npm run dev`.
3. Siga as [convenções de código](./CODING_STANDARDS.md).
4. Se a mudança tem lógica nova em `src/utils`, adicione testes em um arquivo `*.test.ts` ao lado do código.
5. Antes de abrir o pull request, rode `npm run check`. O comando verifica a formatação, o lint, os tipos e os testes.
6. Se a mudança afeta um documento gerado, rode também `npm run pdf:check`. Esse comando precisa do Poppler, que fornece `pdftoppm` e `pdftotext`. No macOS, instale com `brew install poppler`.

## Faça o commit

A cada commit, o hook de pré-commit roda o Prettier e o ESLint nos arquivos preparados. O hook corrige o que consegue. Se restar algum erro, o commit é abortado: corrija o erro e tente de novo.

Escreva as mensagens em inglês, no formato [Conventional Commits](https://www.conventionalcommits.org/):

```text
<tipo>(<escopo opcional>): <resumo>
```

| Tipo       | Quando usar                                     |
| ---------- | ----------------------------------------------- |
| `feat`     | Funcionalidade nova                             |
| `fix`      | Correção de bug                                 |
| `docs`     | Mudança só em documentação                      |
| `style`    | Formatação, sem mudança de comportamento        |
| `refactor` | Mudança de estrutura, com o mesmo comportamento |
| `test`     | Testes novos ou corrigidos                      |
| `chore`    | Dependências e ferramentas                      |
| `ci`       | Workflows do GitHub Actions                     |

## Abra o pull request

1. Envie a branch para o seu fork.
2. Abra o pull request contra `main`. Explique o que mudou e por quê.
3. Espere o CI. O workflow roda `npm run check` e o build, e os dois precisam passar.
