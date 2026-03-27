# AGENTS.md

This document provides guidelines for agentic coding agents working in this repository.

## Project Overview

This is a pnpm monorepo containing a service platform connecting seekers with providers.

**Package manager:** pnpm 10.17.1

### Applications

- **apps/server**: NestJS backend (port 3000)
- **apps/seeker-app**: Expo/React Native mobile app (port 3200)
- **apps/provider-app**: Expo/React Native mobile app (port 3100)

### Packages

- **packages/database**: Drizzle ORM schema and migrations (PostgreSQL/PostGIS)
- **packages/components**: Shared React Native UI components
- **packages/xendit-payment-engine**: Valibot enforced SDK for interfacing with the relevant Xendit components
- **packages/theme**: Shared theme constants (colors, spacing, typography, shadows, service type icons)
- **packages/shared**: Shared auth (`better-auth`), API client, socket client, React Query setup, validators
- **packages/types**: Shared TypeScript types for API responses and socket events

### Key Technologies

- **Backend:** NestJS, Socket.io (real-time messaging), AWS S3 (file storage), Xendit (payments), `expo-server-sdk` (push notifications)
- **Mobile:** Expo, React Navigation, React Query, React Hook Form, React Native Maps, Lucide icons, expo-location, expo-notifications, expo-image-picker
- **Auth:** `better-auth` with `@better-auth/expo` for mobile
- **Database:** PostgreSQL with PostGIS extension (Docker image: `postgis/postgis:18-3.6-alpine`)
- **Validation:** Zod (runtime validation and NestJS request pipes)
- **Schema ORM:** Drizzle ORM with `drizzle-zod` for schema-to-validator generation

## Environment Variables

Required env vars (set in root `.env`):

```
DATABASE_URL                  # PostgreSQL connection string
XENDIT_SECRET_KEY             # Xendit payment gateway secret
EXPO_PUBLIC_API_URL           # API URL exposed to mobile apps
PORT                          # Server port (default: 3000)
GOOGLE_MAPS_API_KEY           # Server-side Google Maps key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY  # Client-side Google Maps key
AWS_REGION                    # AWS S3 region
AWS_ACCESS_KEY_ID             # AWS credentials
AWS_SECRET_ACCESS_KEY         # AWS credentials
S3_BUCKET_NAME                # S3 bucket for file uploads
S3_PUBLIC_URL                 # Public URL for S3 assets
```

## Docker / Database

```bash
pnpm docker:dev               # Start PostgreSQL (PostGIS) via Docker Compose
pnpm docker:down              # Stop Docker containers
```

The database runs on port 5432 with PostGIS spatial extensions enabled.

## Build, Lint, and Test Commands

### Root Commands (run from repository root)

```bash
pnpm install                  # Install all dependencies
pnpm dev:db                   # Start database package in watch mode
pnpm dev:server               # Start NestJS server in watch mode
pnpm dev:android:seeker       # Start seeker app on Android
pnpm dev:android:provider     # Start provider app on Android
pnpm dev:android              # Start all: db + server + both Android apps
pnpm dev:ios:seeker           # Start seeker app on iOS
pnpm dev:ios:provider         # Start provider app on iOS
pnpm dev:ios                  # Start all: db + server + both iOS apps
pnpm lint                     # Run ESLint on entire repo
pnpm lint:fix                 # Auto-fix linting issues
pnpm fmt                      # Check formatting with Prettier
pnpm fmt:fix                  # Auto-fix formatting
pnpm db:generate              # Generate Drizzle migrations
pnpm db:migrate               # Apply database migrations
pnpm db:studio                # Open Drizzle Studio GUI
```

### Server App Commands (apps/server)

```bash
cd apps/server
pnpm run dev                  # Start NestJS with watch mode
pnpm run build                # Build for production
pnpm run test                 # Run all Jest tests
pnpm run test:watch           # Run tests in watch mode
pnpm run test:cov             # Run tests with coverage
pnpm run test:e2e             # Run end-to-end tests
# Run single test file
pnpm test -- <test-file-path>
# Example: pnpm test -- users/users.service.spec.ts
```

### Database Package Commands (packages/database)

```bash
cd packages/database
pnpm run dev                  # Watch mode for building
pnpm run build                # Build TypeScript
pnpm run generate             # Generate Drizzle migrations
pnpm run migrate              # Apply migrations
pnpm run studio               # Open database GUI
```

## CI/CD

GitHub Actions runs on push to `main` and on pull requests:

- `pnpm fmt` — Prettier formatting check
- `pnpm lint` — ESLint check

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

- Use **Zod** for runtime validation
- Parse environment variables with Zod schemas:

```typescript
import { z } from 'zod';

export const XENDIT_SECRET_KEY = z.string().parse(process.env.XENDIT_SECRET_KEY);
```

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
- PostGIS geography types used for location/coordinate columns

### NestJS Patterns

- Use dependency injection via decorators (`@Injectable()`, `@Inject()`)
- Use constructor injection with `readonly` modifier
- Organize modules by domain feature
- Use `@Session()` decorator for authenticated user context

### Testing

- Place test files adjacent to source with `.spec.ts` suffix
- Use NestJS Testing module for services
- Follow Arrange-Act-Assert pattern
- Aim for meaningful test coverage on business logic
