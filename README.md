# Raffle System API

A Bun/Elysia API for listing raffles, purchasing tickets, and drawing raffle winners. The API uses PostgreSQL with Drizzle ORM and includes OpenAPI documentation, seed data, and a scheduled draw job.

## Tech Stack

- Bun
- Elysia
- PostgreSQL
- Drizzle ORM / Drizzle Kit / drizzle-typebox
- Biome

## Prerequisites

- Bun installed
- PostgreSQL running locally or a reachable PostgreSQL instance

## Setup

1. Install dependencies:

```bash
bun install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

3. Create the local database:

```bash
createdb raffolux
```

4. Run migrations:

```bash
bun run db:migrate
```

5. Seed the database:

```bash
bun run db:seed
```

6. Start the API:

```bash
bun run dev
```

The API runs at `http://localhost:3000` by default.

## Environment

The app reads `.env` and `.env.local`. Values in `.env.local` override `.env`.

Required variables:

```env
DATABASE_URL=postgresql://postgres@localhost:5432/raffolux
DATABASE_SSL_ENABLED=false
```

Optional variables:

```env
NODE_ENV=development
LOG_LEVEL=info
```

## API Documentation

OpenAPI documentation is available after starting the server:

```text
http://localhost:3000/openapi
```

## Authentication

Raffle and ticket endpoints use a mock bearer JWT. The token signature is not verified; the API only reads the JWT payload and expects a UUID `sub` claim.

Seed users:

- `0d80ce5c-dbd9-46bb-bf3b-cc74a19c38ab` / `hamidadelyar@gmail.com`
- `55d20737-a618-4b56-9a10-60f2bb857cb5` / `johnsmith@gmail.com`

Example token payload:

```json
{
  "sub": "0d80ce5c-dbd9-46bb-bf3b-cc74a19c38ab",
  "email": "hamidadelyar@gmail.com"
}
```

Bearer auth to use

```
mock.[base64encodedjson].signature
```

Example request:

```bash
curl http://localhost:3000/raffles \
  -H 'Authorization: Bearer <mock-jwt>'
```

## Endpoints

Authenticated endpoints:

- `GET /raffles` - list raffles with prize details
- `GET /raffles/:id` - get a raffle by ID
- `POST /raffles/:raffleId/tickets` - purchase one or more tickets for the authenticated user
- `GET /me/tickets` - list tickets purchased by the authenticated user

## Raffle Drawing

Due raffles are drawn automatically once every 5 minutes while the API is running. A raffle is eligible when:

- `status` is `active`
- `winner_id` is `null`
- `draw_date` is in the past

If an overdue raffle has sold no tickets, it is cancelled instead of being left active without a possible winner.

You can also run the draw job manually:

```bash
bun run raffles:draw
```

## Design Decisions and Trade-Offs

- The API uses a mocked bearer JWT parser to keep authentication lightweight for the technical test. This makes endpoints easy to exercise locally.

- Ticket purchase updates the raffle and user balance inside a database transaction. This keeps the purchase flow consistent if one step fails, at the cost of a little more repository complexity.

- Raffle capacity is enforced in the update query with `tickets_sold < max_tickets`. This avoids overselling under concurrent purchases without requiring application-level locks.

- Raffle drawing runs through an in-process cron for simplicity. This is convenient locally, but in production it should be moved to a dedicated worker or protected by distributed locking so multiple API instances do not run the same job.

- Due raffles are selected with `FOR UPDATE SKIP LOCKED`. This lets draw workers avoid blocking each other, but the current in-process cron still keeps the operational model intentionally simple.

- Overdue raffles with no sold tickets are marked `cancelled`.

- Drizzle migrations are committed and used as the source of truth for database changes.

- API schemas are derived from the Drizzle schema using `drizzle-typebox` where practical. This reduces duplication between database models and route validation/response schemas, though endpoint-specific schemas may still be needed when the API shape differs from the table shape.

- The API returns a consistent `{ data, success, error }` response shape. This makes client handling predictable, though it adds a small amount of response wrapping for simple endpoints.

- `@bogeychan/elysia-logger` is used for logging with `pino` under the hood. The current logger is intentionally simple for the technical test. It is missing correlation ids, redactions rules amongst other features.

## Database Commands

```bash
bun run db:generate  # generate Drizzle migrations from schema changes
bun run db:migrate   # apply migrations
bun run db:push      # push schema directly to the database
bun run db:seed      # insert/update seed data
bun run db:studio    # open Drizzle Studio
```

## Development Commands

```bash
bun run dev           # start API in watch mode
bun run dev:portless  # start API through portless
bun test              # run tests
bun run check         # run Biome checks
bun run check:apply   # auto-fix Biome issues
bun run format        # check formatting
bun run format:write  # write formatting changes
```

## Notes

- `dev:portless` can expose the app at `https://raffle-system-api.localhost` when portless is configured.
