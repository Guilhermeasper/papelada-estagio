# Contributing to Papelada Estágio

First off, thank you for considering contributing to Papelada Estágio! It's people like you that make this tool great.

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/papelada-estagio.git
   cd papelada-estagio
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   *We recommend prefixes like `feature/`, `bugfix/`, `docs/`, or `refactor/`.*

## Development Workflow

- Run the local development server:
  ```bash
  npm run dev
  ```
- Make sure to review the [Coding Standards](./CODING_STANDARDS.md) before making code changes.

## Pre-commit Hooks

This project uses **Husky** and **Lint-Staged** to automatically lint and format code before every commit. You don't need to do anything manually, but if your code fails the lint checks, the commit will be aborted. Fix the errors and try committing again.

## Committing Your Changes

We follow conventional commit messages to make the history clean and readable. Please try to adhere to the following format:

```
<type>(<scope>): <subject>

<body>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

## Submitting a Pull Request

1. Push your changes to your fork on GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of the original repository.
3. Describe your changes in detail in the PR description, referencing any open issues it resolves.
4. Wait for a code review and address any feedback!

Thanks again for contributing!
