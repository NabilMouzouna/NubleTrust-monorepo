# @postgres-drizzle

This package contains the database schema, migrations, and query functions for the NubleTrust project. It uses [Drizzle ORM](https://orm.drizzle.team/) for type-safe SQL queries and [drizzle-kit](https://orm.drizzle.team/kit/overview) for managing migrations.

## Overview

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Schema Definition**: `src/schema.ts`
- **Migrations**: `drizzle/`
- **Query Functions**: `src/functions/`

## Setup

1.  **Environment Variables**: Copy the `.env.example` file to a new file named `.env` and fill in your PostgreSQL connection details.

    ```bash
    DATABASE_URL="postgresql://username:pasword@localhost:5432/database"
    ```

2.  **Install Dependencies**: From the root of the monorepo, run:
    ```bash
    pnpm install
    ```

## Schema

The database schema is defined in `src/schema.ts` and consists of the following tables:

-   `applications`: Stores information about registered applications, including their API keys and allowed domains.
-   `app_users`: Stores user accounts for each application. Users are unique per application.
-   `user_sessions`: Manages user sessions, including JWTs, risk scores, and device information.
-   `risk_events`: Logs specific events during a user session that may indicate risk.

## Core Functions

All query functions are exported from the package root.

### Database Connection

The main database instance is exported from `src/db.ts`.

```typescript
import { db } from '@nubletrust/database';
```

### Application Functions (`src/functions/app.ts`)

-   `createApplication(data)`: Creates a new application.
-   `getApplicationById(id)`: Retrieves an application by its UUID.
-   `getApplicationByApiKey(apiKey)`: Retrieves an application by its API key.
-   `updateApplication(id, data)`: Updates an application's details.
-   `deleteApplication(id)`: Deletes an application.
-   `getAllApplications()`: Retrieves all applications.

### User Functions (`src/functions/user.ts`)

-   `createAppUser(data)`: Creates a new user for an application.
-   `getAppUserById(id)`: Retrieves a user by their UUID.
-   `getAppUserByEmail(appId, email)`: Retrieves a user by their email within a specific application.
-   `updateAppUser(id, data)`: Updates a user's details.
-   `deleteAppUser(id)`: Deletes a user.
-   `getAllAppUsers(appId)`: Retrieves all users for a specific application.

### Session Functions (`src/functions/session.ts`)

-   `createUserSession(data)`: Creates a new user session.
-   `getUserSessionById(id)`: Retrieves a session by its UUID.
-   `updateUserSession(id, data)`: Updates a session.
-   `deleteUserSession(id)`: Deletes a session.
-   `getAllUserSessions(userId)`: Retrieves all sessions for a specific user.

### Risk Event Functions (`src/functions/riskEvent.ts`)

-   `createRiskEvent(data)`: Logs a new risk event.
-   `getRiskEventById(id)`: Retrieves a risk event by its UUID.
-   `getAllRiskEventsForSession(sessionId)`: Retrieves all risk events for a specific session.

## Scripts

The following scripts are available in this package's `package.json`:

-   `pnpm build`: Compiles the TypeScript source code.
-   `pnpm db:generate`: Generates a new SQL migration file based on changes to the schema in `src/schema.ts`.
-   `pnpm db:migrate`: Applies all pending migrations to the database.
-   `pnpm db:studio`: Starts the Drizzle Studio, a local GUI for browsing your database.
-   `pnpm db:health`: Checks if the database connection is successful.
