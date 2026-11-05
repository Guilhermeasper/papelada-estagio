# Convenções de código

As ferramentas verificam as regras da primeira seção. As demais dependem de revisão.

## Regras verificadas por ferramentas

`npm run check` e o CI verificam estas regras. O hook de pré-commit verifica a formatação e o lint dos arquivos preparados.

### Formatação

O Prettier cuida da formatação com a configuração padrão: aspas duplas, vírgula final, dois espaços e fim de linha LF.

### TypeScript

O ESLint usa os conjuntos `strictTypeChecked` e `stylisticTypeChecked` do `typescript-eslint`. Nenhum aviso é permitido.

| Regra                                     | O que fazer                                                  |
| ----------------------------------------- | ------------------------------------------------------------ |
| `any` é proibido                          | Use `unknown` e faça o parse com Zod ou restrinja o tipo     |
| Asserção não nula (`!`) é proibida        | Restrinja o tipo ou modele o caso com uma união discriminada |
| `interface` em vez de `type` para objetos | Use `type` para uniões e tipos derivados                     |
| Promises não podem ficar soltas           | Use `await`, ou `void` quando o resultado não importa        |
| Condições desnecessárias são proibidas    | Remova a condição, ou corrija o tipo se o valor pode faltar  |

Uma leitura de array por índice tem tipo sempre definido, mas pode ser `undefined` em tempo de execução. Para o último item, use `array.at(-1)`.

### React

| Regra                                    | O que fazer                                                                 |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| Regras de hooks do React                 | Chame hooks só no nível superior do componente                              |
| `forwardRef` é proibido                  | Receba `ref` como prop, com o tipo `React.Ref<T>`                           |
| Índice do array como `key` é proibido    | Use um valor estável do item                                                |
| `setState` síncrono em efeito é proibido | Derive o valor durante a renderização ou use um inicializador de `useState` |
| Só componentes em arquivos `.tsx`        | Coloque constantes e funções compartilhadas em arquivos `.ts`               |

### Exceções

`eslint.config.js` define estas exceções, cada uma com o motivo:

- `src/**/*.test.ts` pode deixar promises soltas, porque o `node:test` acompanha as promises de `describe` e `it`.
- `src/components/pdf/**` e `src/documents/**` podem usar o índice como `key`, porque os PDFs são renderizados uma vez a partir de listas estáticas.
- `src/utils/migrations.ts` pode usar `any`, porque as migrações leem formatos antigos que não têm mais tipos.

Fora desses casos, um `eslint-disable` precisa de um motivo depois de `--`:

```ts
// eslint-disable-next-line react-x/no-array-index-key -- itens editáveis sem id
```

## Regras verificadas em revisão

### Nomes de arquivos

- Componentes usam PascalCase: `DateInput.tsx`.
- Hooks e utilitários usam camelCase: `useWizardData.ts`, `dateUtils.ts`.
- Diretórios usam kebab-case: `src/documents/activity-plan/`.

### Importações e exportações

- Use exportações nomeadas. As únicas exportações padrão são `src/App.tsx` e `src/i18n/index.ts`.
- Use o alias `@papelada-estagio/*` para importar de outro diretório.

### Componentes

Declare componentes com `export function` e desestruture as props na assinatura:

```tsx
export function RadioGroup({
  ref,
  value,
  onChange,
  ...props
}: RadioGroupProps & { ref?: React.Ref<HTMLInputElement> }) {
```

### Dados externos

Dados que vêm de arquivos importados entram como `unknown` e passam pelo Zod. Os schemas ficam em `src/wizard/schemas/`.

### Textos

- Textos novos da interface ficam em `src/locales/pt-BR.json`.
- Textos oficiais dos formulários ficam em `src/constants/pdf-content.ts`.

### Testes

- Os testes usam `node:test` e ficam ao lado do código, em arquivos `*.test.ts`.
- O código testado não pode importar React nem arquivos `.tsx`. Por isso, utilitários importam constantes de `@papelada-estagio/constants/business`, e não de `@papelada-estagio/constants`.
