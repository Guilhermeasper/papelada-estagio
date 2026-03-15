# Coding Standards for Papelada Estágio

To maintain a readable, maintainable, and robust codebase, all contributors must follow these coding standards. These rules are heavily inspired by Google's TypeScript Style Guide and standard React best practices.

## General TypeScript Practices

### 1. File Naming Conventions
- **PascalCase** for React components (e.g., `Button.tsx`, `UserProfile.tsx`).
- **camelCase** for utilities, hooks, functions, constants, or classes (e.g., `dateUtils.ts`, `useFetch.ts`, `constants.ts`).
- **kebab-case** for directories whenever possible (e.g., `src/components/user-profile/`).

### 2. Typing and Interfaces
- Use `interface` over `type` unless you need specific features of a type alias (e.g., unions or intersections).
- **Strict Typing:** Avoid `any` at all costs. Use `unknown` if a type is truly indeterminate, and narrow it down later.
- Use explicit return types on functions (especially custom hooks and utilities) whenever it adds clarity or prevents TypeScript inference issues.
  ```ts
  // Good
  function calculateTotal(price: number, tax: number): number { ... }
  ```

### 3. Imports and Exports
- **Named Exports:** Prefer named exports over default exports. Named exports improve autocomplete, prevent naming mismatches, and simplify refactoring.
  ```ts
  // Good
  export const MyComponent = () => { ... };
  import { MyComponent } from './MyComponent';
  ```
- Exception: Default exports are fine for Next.js/Vite pages or route configurations where the framework expects them.

### 4. Variables and Functions
- Use `const` by default. Only use `let` when the variable must be reassigned. Never use `var`.
- Favor arrow functions for anonymous callbacks.
- Use meaningful variable and function names. A function name should usually be a verb (e.g., `fetchData`, `formatDate`).

## React Best Practices

### 1. Functional Components
- Use React Functional Components with Hooks. Avoid Class Components.
- Use the `React.FC` or `React.FunctionComponent` type for functional components only if you explicitly need it; otherwise, typing the `props` argument directly is preferred.
  ```tsx
  // Good
  interface ButtonProps {
    label: string;
    onClick: () => void;
  }
  export const Button = ({ label, onClick }: ButtonProps) => { ... }
  ```

### 2. State and Side Effects
- Initialize state close to where it's needed. Don't lift state up unless multiple components require access to it.
- **useEffect:** Always provide a dependency array to `useEffect` unless you deliberately want it to run on every render (rare). Avoid placing complex logic inside `useEffect`; extract it into external functions or custom hooks.

### 3. Props Destructuring
- Destructure props in the function signature for clarity.
  ```tsx
  // Bad
  const UserProfile = (props: UserProps) => { return <div>{props.name}</div>; }

  // Good
  const UserProfile = ({ name }: UserProps) => { return <div>{name}</div>; }
  ```

### 4. JSX Rules
- Use self-closing tags for components without children (`<Component />`).
- Keep JSX clean. Extract complex conditional rendering into separate sub-components or variables.
  ```tsx
  // Bad
  <div>
    {user && user.isLoggedIn && !user.isBanned && ( ... )}
  </div>

  // Good
  const canViewProfile = user?.isLoggedIn && !user?.isBanned;
  <div>
    {canViewProfile && ( ... )}
  </div>
  ```

## Linting and Formatting

We use **ESLint** and **Prettier** to automatically enforce these rules.
- **Prettier:** Handles all code formatting (e.g., single quotes, trailing commas, line breaks).
- **ESLint:** Handles code quality rules, strict TypeScript typing checks, and React-specific guidelines.

Before you submit a PR, Husky pre-commit hooks will automatically run `lint-staged` to ensure your code is formatted and passes ESLint rules.

If you want to manually check your code, you can run:
```bash
npm run lint
npm run prettier
```
