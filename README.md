<div align="center">
  <h1>Battleship 🚀</h1>
</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Tooling](#tooling)
  - [Code Quality](#code-quality)
    - [ESLint plugins and configs:](#eslint-plugins-and-configs)
- [Getting Started](#getting-started)

## Overview

This is an implementation of the popular classic game, Battleship. This project is built using Next.js.

## Tooling

### Code Quality

Battleship ensures code quality by integrating several essential tools:

- [**Prettier**](https://prettier.io) : Prettier is a formatter that helps maintain a consistent code style, making your codebase clean and easy to read.

- [**ESLint**](https://eslint.org) : ESLint is a powerful code linter that helps catch errors, enforce code style, and maintain code quality.

- [**Husky**](https://typicode.github.io/husky/) : Husky provides Git hooks that prevent bad git commit, git push, and more by running scripts.

- [**Lint-Staged**](https://github.com/lint-staged/lint-staged#readme) : Lint-Staged allows you to run linters on pre-committed files, ensuring that only clean and properly formatted code is committed.

- [**CommitLint**](https://commitlint.js.org/#/) : CommitLint enforces a consistent commit message format, enhancing collaboration and version control.

#### ESLint plugins and configs:

- [**@typescript-eslint/eslint-plugin**](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) : An ESLint plugin which provides lint rules for TypeScript codebases.

- [**eslint-config-next**](https://www.npmjs.com/package/eslint-config-next) : Includes Next.js' base ESLint configuration along with a stricter Core Web Vitals rule-set.

- [**eslint-plugin-import**](https://www.npmjs.com/package/eslint-plugin-import) : This plugin intends to support linting of ES2015+ (ES6+) import/export syntax, and prevent issues with misspelling of file paths and import names.
- [**eslint-plugin-jsx-a11y**](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) : Static AST checker for accessibility rules on JSX elements.
- [**eslint-plugin-react**](https://www.npmjs.com/package/eslint-plugin-react) : React specific linting rules for eslint
- [**eslint-plugin-react-hooks**](https://www.npmjs.com/package/eslint-plugin-react-hooks) : This ESLint plugin enforces the [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html).
- [**eslint-plugin-simple-import-sort**](https://www.npmjs.com/package/eslint-plugin-simple-import-sort) : Easy autofixable import sorting.

- [**eslint-plugin-tailwindcss**](https://www.npmjs.com/package/eslint-plugin-tailwindcss) : Rules enforcing best practices and consistency using Tailwind CSS.

## Getting Started

First, install the dependencies:

```bash
yarn install
```

Next, run the development server:

```bash
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
