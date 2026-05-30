# Raffle System API

## Development
To start the development server run:
```bash
bun run dev
```
You can then access the server on localhost:3000 or https://raffle-system-api.localhost (if using bun run dev:portless)

## Prerequisites

### General

Ensure .env.local file is created and populated

### DB

1. Create postgres db

```zsh
CREATEDB raffolux
```

2. Run migrations

```zsh
bun run db:migrations
```