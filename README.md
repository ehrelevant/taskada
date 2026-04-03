# Taskada

This repository contains the main project files used for the implementation of Taskada: a digital platform for connecting service seekers with local service providers.

## Environment Variables

Each app/package requires its own `.env` file. Copy the corresponding `.env.example` and fill in the values.

### Root (`.env`)

| Variable                  | Description                                            | Example          |
| ------------------------- | ------------------------------------------------------ | ---------------- |
| `POSTGRES_DB`             | PostgreSQL database name                               | `postgres`       |
| `POSTGRES_USER`           | PostgreSQL username                                    | `postgres`       |
| `POSTGRES_PASSWORD`       | PostgreSQL password                                    | `password`       |
| `ANDROID_DEVICE_SEEKER`   | Android device ID for seeker app (run `adb devices`)   | `Medium_Phone`   |
| `ANDROID_DEVICE_PROVIDER` | Android device ID for provider app (run `adb devices`) | `Medium_Phone_2` |

### Server (`apps/server/.env`)

| Variable                | Description                                  | Example                                                |
| ----------------------- | -------------------------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`          | PostgreSQL connection string                 | `postgres://postgres:password@localhost:5432/postgres` |
| `BETTER_AUTH_URL`       | Base URL for the auth service                | `http://localhost:3000`                                |
| `BETTER_AUTH_SECRET`    | Secret key for auth token signing            |                                                        |
| `XENDIT_SECRET_KEY`     | Xendit payment gateway secret key            | `xnd_development_...`                                  |
| `GOOGLE_MAPS_API_KEY`   | Server-side Google Maps API key              | `AIzaSy...`                                            |
| `AWS_REGION`            | AWS S3 region                                | `ap-southeast-1`                                       |
| `AWS_ACCESS_KEY_ID`     | AWS access key ID                            |                                                        |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key                        |                                                        |
| `S3_BUCKET_NAME`        | S3 bucket name for file uploads              | `taskada-bucket`                                       |
| `S3_PUBLIC_URL`         | Public URL for S3 assets                     | `https://taskada-bucket.s3.amazonaws.com`              |
| `CORS_ORIGINS`          | Comma-separated list of allowed CORS origins | `https://yourdomain.com,seeker-app://,provider-app://` |

### Seeker App (`apps/seeker-app/.env`)

| Variable                          | Description                     | Example                 |
| --------------------------------- | ------------------------------- | ----------------------- |
| `EXPO_PUBLIC_API_URL`             | Base URL for the API server     | `http://localhost:3000` |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Client-side Google Maps API key | `AIzaSy...`             |

### Provider App (`apps/provider-app/.env`)

| Variable                          | Description                     | Example                 |
| --------------------------------- | ------------------------------- | ----------------------- |
| `EXPO_PUBLIC_API_URL`             | Base URL for the API server     | `http://localhost:3000` |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Client-side Google Maps API key | `AIzaSy...`             |

### Database Package (`packages/database/.env`)

| Variable              | Description                  | Example                                                |
| --------------------- | ---------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`        | PostgreSQL connection string | `postgres://postgres:password@localhost:5432/postgres` |
| `SEED_ADMIN_EMAIL`    | Admin email for seeding      | `admin@example.com`                                    |
| `SEED_ADMIN_PHONE`    | Admin phone for seeding      | `09171234567`                                          |
| `SEED_ADMIN_PASSWORD` | Admin password for seeding   | `password`                                             |

### Moderation App (`apps/moderation/.env`)

| Variable  | Description                 | Example                 |
| --------- | --------------------------- | ----------------------- |
| `API_URL` | Base URL for the API server | `http://localhost:3000` |

### Xendit Package (`packages/xendit-payment-engine/.env`)

| Variable               | Description          | Example                      |
| ---------------------- | -------------------- | ---------------------------- |
| `XENDIT_CLIENT_ID`     | Xendit client ID     | `xnd_public_development_...` |
| `XENDIT_CLIENT_SECRET` | Xendit client secret | `xnd_development_...`        |
| `XENDIT_API_URL`       | Xendit API base URL  | `https://api.xendit.co`      |

### Build Scripts (`scripts/.env.build`)

| Variable                    | Description                               | Example           |
| --------------------------- | ----------------------------------------- | ----------------- |
| `TASKADA_KEYSTORE_PASSWORD` | Password for the Android signing keystore | `your-password`   |
| `TASKADA_KEY_ALIAS`         | Alias for the signing key                 | `taskada-release` |
| `TASKADA_VALIDITY_DAYS`     | Keystore validity in days                 | `10000`           |

## Development

This project's dependencies are managed by [`pnpm`](https://pnpm.io/), a package manager for [Node.js](https://nodejs.org/).

```bash
# Install dependencies (for all workspaces)
pnpm install
```

### Running the Development Servers

This project is a monorepo containing several apps. The development servers of all applications may be run in parallel with the following command:

```bash
# Start local development servers for all apps
# - http://<host>:3000 - Server
# - http://<host>:3100 - Provider App
# - http://<host>:3200 - Seeker App
pnpm dev

# Starts a android development build for all apps
pnpm dev:android

# Starts a ios development build for all apps
pnpm dev:ios
```

### Linting & Formatting

Before pushing or submitting a pull request to the repository, ensure that it has passed all the code quality checks by linting and formatting it. This is done to ensure that the codebase remains clean and consistent.

```bash
# Check formatting
pnpm fmt

# Fix formatting
pnpm fmt:fix

# Checks linting
pnpm lint

# Fix linting (where possible)
pnpm lint:fix
```

### Database Management

This project uses [Drizzle ORM](https://orm.drizzle.team/) for managing its database. The files pertaining to managing the project's database are stored in the `database` package (see [Database Package](#database-package-packagesdatabaseenv) for required environment variables).

```bash
# Generate SQL migration files from schema
pnpm db:generate

# Apply generated SQL migration files to the Database
pnpm db:migrate

# Connect to the database with a GUI
pnpm db:studio
```

### Building Release APKs

Build signed release APKs for both mobile apps:

```bash
pnpm build:apps
```

This requires:

- `apps/seeker-app/.env.production` and `apps/provider-app/.env.production` with production values (see [Environment Variables](#environment-variables))
- `scripts/.env.build` with signing credentials (see [Build Scripts](#build-scripts-scriptsenvbuild))

The APKs are output to the `releases/` directory as `taskada-seeker.apk` and `taskada-provider.apk`.

## Production Docker

Use the production compose stack to deploy only long-running services (`database`, `server`, `moderation`) and run DB operations (`migrate`, `seed`) on demand.

### Required Environment Files

- `.env.production`
- `apps/server/.env.production`
- `apps/moderation/.env.production`
- `packages/database/.env.production`
- `packages/xendit-payment-engine/.env.production`

### Build and Start

```bash
# Build production images
pnpm docker:prod:build

# Start long-running services
pnpm docker:prod
```

### Run Migrations / Seed On Demand

```bash
# Run migrations once
pnpm docker:prod:migrate

# Run seed once
pnpm docker:prod:seed
```

These jobs are configured as operational profile services, so they do not start during normal deployment.

### Stop the Stack

```bash
pnpm docker:prod:down
```
