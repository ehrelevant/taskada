# AGENTS.md

This document provides guidelines for agentic coding agents working in this repository.

## Project Overview

This is a monorepo containing a service platform connecting seekers with providers:

- **apps/server**: NestJS backend with PostgreSQL (port 3000)
- **apps/seeker-app**: Expo/React Native mobile app (port 3200)
- **apps/provider-app**: Expo/React Native mobile app (port 3100)
- **packages/database**: Drizzle ORM schema and migrations
- **packages/components**: Shared React Native UI components
- **packages/theme**: Shared theme constants (colors, spacing, typography)

## Build, Lint, and Test Commands

### Root Commands (run from repository root)

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start all dev servers in parallel
pnpm dev:android          # Start Android development builds
pnpm dev:ios              # Start iOS development builds
pnpm lint                 # Run ESLint on entire repo
pnpm lint:fix             # Auto-fix linting issues
pnpm fmt                  # Check formatting with Prettier
pnpm fmt:fix              # Auto-fix formatting
pnpm db:generate          # Generate Drizzle migrations
pnpm db:migrate           # Apply database migrations
pnpm db:studio            # Open Drizzle Studio GUI
```

### Server App Commands (apps/server)

```bash
cd apps/server
pnpm run dev              # Start NestJS with watch mode
pnpm run build            # Build for production
pnpm run test             # Run all Jest tests
pnpm run test:watch       # Run tests in watch mode
pnpm run test:cov         # Run tests with coverage
pnpm run test:e2e         # Run end-to-end tests
# Run single test file
pnpm test -- <test-file-path>
# Example: pnpm test -- users/users.service.spec.ts
```

### Database Package Commands (packages/database)

```bash
cd packages/database
pnpm run dev              # Watch mode for building
pnpm run build            # Build TypeScript
pnpm run generate         # Generate Drizzle migrations
pnpm run migrate          # Apply migrations
pnpm run studio           # Open database GUI
```

## Code Style Guidelines

### General

- Use **single quotes** for strings
- Use **2 spaces** for indentation
- Use **PascalCase** for components, classes, and types
- Use **camelCase** for functions, variables, and object properties
- Use **SCREAMING_SNAKE_CASE** for constants
- Use **kebab-case** for file names (except components which use PascalCase)
- Maximum line width: 120 characters
- Always use explicit return types for exported functions
- Enable **strictNullChecks** in TypeScript configs

### Imports and Ordering

- ESLint plugin `@bastidood/eslint-plugin-imsort` enforces import sorting
- Group imports in this order: Node modules, external packages, workspace packages (@repo/\*), relative imports
- Use named exports instead of default exports where possible
- Example:

```typescript
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { user } from '@repo/database';

import { DatabaseService } from '../database/database.service';
```

### TypeScript

- Enable `strictNullChecks` but allow `noImplicitAny: false`
- Use `Record<string, unknown>` for generic object types
- Use explicit return types on all exported functions
- Prefix unused parameters with `_` (e.g., `_oldPassword`)
- Use interface for object shapes, type for unions/primitives
- Avoid `any` type; use `unknown` when type is uncertain

### React Native Components

- Separate component logic (`.tsx`) from styles (`.styles.ts`)
- Use functional components with TypeScript interfaces for props
- Use named exports for all components
- Use theme constants from `@repo/theme` for colors, spacing, typography
- Example structure:

```
Button/
  Button.tsx       # Component logic
  Button.styles.ts # StyleSheet creation
  index.ts         # Barrel export
```

- Always extend base props (e.g., `TouchableOpacityProps`)

### Validation

- Use **Valibot** for runtime validation
- Parse environment variables with Valibot schemas:

```typescript
import { parse, string } from 'valibot';
export const XENDIT_SECRET_KEY = parse(string(), process.env.XENDIT_SECRET_KEY);
```

- Use Valibot pipes for NestJS request validation

### Error Handling

- Use NestJS built-in exceptions (`NotFoundException`, `BadRequestException`)
- Include meaningful error messages with context
- Handle database errors with try/catch blocks
- Never expose stack traces in production responses

### Database (Drizzle ORM)

- Use `snake_case` casing for database schema
- Use explicit column selections in queries (avoid `select(*)`)
- Use `eq()` and other operators from `drizzle-orm` for conditions
- Always handle `null` cases explicitly

### NestJS Patterns

- Use dependency injection via decorators (`@Injectable()`, `@Inject()`)
- Use constructor injection with `readonly` modifier
- Organize modules by domain feature
- Use `ValibotPipe` for request validation
- Use `@Session()` decorator for authenticated user context

### Testing

- Place test files adjacent to source with `.spec.ts` suffix
- Use NestJS Testing module for services
- Follow Arrange-Act-Assert pattern
- Aim for meaningful test coverage on business logic
