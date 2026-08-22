# GlobeTrotter — Database Layer

MySQL database schema and Prisma ORM setup for the GlobeTrotter travel-planning
application. This directory documents the database; the schema itself lives in
[`prisma/schema.prisma`](../prisma/schema.prisma) and is applied via Prisma
migrations in [`prisma/migrations/`](../prisma/migrations/).

This entire database/backend layer lives under `server/` (sibling to the
frontend at the repo root, which has its own `package.json`). All commands
below assume your working directory is `server/`, not the repo root.

```
React (frontend)
  ↓ REST API
Node.js + Express (backend, built separately by teammates)
  ↓
Prisma Client
  ↓
MySQL
```

## 1. Prerequisites

- MySQL Server 8.0+ running locally or reachable over the network
- Node.js 18+ and npm
- A MySQL user with permission to create databases/tables (or a pre-created
  empty database and a user with full privileges on it)

## 2. Create the MySQL database

Connect to your MySQL server and run:

```sql
CREATE DATABASE globetrotter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

(You can name the database whatever you like — just match it in `DATABASE_URL`.)

## 3. Configure `.env`

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

```
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/globetrotter"
```

If your password contains special characters (`@ # ! %` etc.), URL-encode
them (e.g. `!` → `%21`, `@` → `%40`, `#` → `%23`).

Never commit `.env` — it's already in `.gitignore`.

## 4. Install dependencies

```bash
npm install
```

## 5. Run migrations

From the project root:

```bash
npx prisma migrate deploy   # apply existing migrations (use this in CI / on a teammate's machine)
# or, when you change prisma/schema.prisma yourself:
npx prisma migrate dev --name <description>
```

This creates all 10 tables plus Prisma's internal `_prisma_migrations`
tracking table, and generates the Prisma Client.

## 6. Run seed data

```bash
npm run db:seed
```

This runs [`prisma/seed.ts`](../prisma/seed.ts), which is idempotent (safe to
re-run — it upserts/finds-or-creates rather than duplicating rows). It creates:

- 1 admin user + 1 demo user (bcrypt-hashed passwords, never plain text)
- 12 cities (Paris, London, Amsterdam, Dubai, Tokyo, Mumbai, Goa, Delhi,
  Singapore, Bali, New York, Rome) with 3–5 activities each
- 1 demo multi-city trip ("European Adventure": Paris → London → Amsterdam)
  with trip stops, day-wise itinerary items, expenses across all categories,
  a saved destination, a community post, and an active share link

A raw-SQL reference dump of the same data is also available at
[`database/seed.sql`](seed.sql) for teammates who prefer inspecting/loading
data without Node — the TypeScript seed script remains the source of truth.

## 7. Inspect the database

```bash
npx prisma studio
```

Opens a browser GUI for viewing/editing rows. Or connect with any MySQL
client (Workbench, DBeaver, `mysql` CLI) using the same credentials as
`DATABASE_URL`.

## 8. How the tables relate

```mermaid
erDiagram
    USERS ||--o{ TRIPS : owns
    USERS ||--o{ SAVED_DESTINATIONS : saves
    USERS ||--o{ COMMUNITY_POSTS : writes

    CITIES ||--o{ ACTIVITIES : has
    CITIES ||--o{ TRIP_STOPS : "visited in"
    CITIES ||--o{ ITINERARY_ITEMS : "located in"
    CITIES ||--o{ SAVED_DESTINATIONS : "saved as"

    TRIPS ||--o{ TRIP_STOPS : contains
    TRIPS ||--o{ ITINERARY_ITEMS : contains
    TRIPS ||--o{ EXPENSES : has
    TRIPS |o--o{ COMMUNITY_POSTS : "referenced by (optional)"
    TRIPS ||--o{ TRIP_SHARES : "shared via"

    ACTIVITIES |o--o{ ITINERARY_ITEMS : "scheduled as"

    USERS {
        int id PK
        string name
        string email UK
        string password_hash
        string phone
        string country
        enum role
    }
    CITIES {
        int id PK
        string name
        string country
        string country_code
        string region
        decimal latitude
        decimal longitude
        string timezone
        int cost_index
        int popularity_score
    }
    ACTIVITIES {
        int id PK
        int city_id FK
        string name
        string category
        decimal cost
        string currency_code
    }
    TRIPS {
        int id PK
        int user_id FK
        string name
        date start_date
        date end_date
        enum status
        bool is_public
    }
    TRIP_STOPS {
        int id PK
        int trip_id FK
        int city_id FK
        int stop_order
        date arrival_date
        date departure_date
    }
    ITINERARY_ITEMS {
        int id PK
        int trip_id FK
        int city_id FK
        int activity_id FK
        date activity_date
        int item_order
    }
    EXPENSES {
        int id PK
        int trip_id FK
        enum category
        decimal amount
        string currency_code
        date expense_date
    }
    SAVED_DESTINATIONS {
        int user_id PK,FK
        int city_id PK,FK
        datetime saved_at
    }
    COMMUNITY_POSTS {
        int id PK
        int user_id FK
        int trip_id FK "nullable"
        string title
        text content
    }
    TRIP_SHARES {
        int id PK
        int trip_id FK
        string share_token UK
        bool is_active
        datetime expires_at
    }
```

### Deletion behavior (ON DELETE)

| Parent deleted | Child effect | Reason |
|---|---|---|
| `users` | `trips`, `saved_destinations`, `community_posts` → **CASCADE** | A deleted user's owned data is deleted with them. |
| `cities` | `activities` → **CASCADE**; `trip_stops`, `itinerary_items` → **RESTRICT** | Activities are meaningless without their city, but a city cannot be removed while trips still reference it (protects trip history). |
| `activities` | `itinerary_items.activity_id` → **SET NULL** | Removing an activity from the catalog shouldn't delete a trip's itinerary — the scheduled item just loses its activity link. |
| `trips` | `trip_stops`, `itinerary_items`, `expenses`, `trip_shares` → **CASCADE**; `community_posts.trip_id` → **SET NULL** | A trip's own planning data goes with it, but a community post that referenced the trip survives (per spec: "deleting a trip should not necessarily delete the community post"). |

### Key constraints

- `users.email` — `UNIQUE`
- `trip_stops` — `UNIQUE (trip_id, stop_order)`, preventing duplicate ordering within a trip
- `saved_destinations` — composite primary key `(user_id, city_id)`, preventing duplicate saves
- `trip_shares.share_token` — `UNIQUE`, used to look up a shared itinerary without exposing the internal trip id
- CHECK constraints (added in the `add_check_constraints` migration, since Prisma's schema DSL doesn't express arbitrary CHECKs): `trips.end_date >= start_date`, `trip_stops.departure_date >= arrival_date`, `itinerary_items.end_time >= start_time`, non-negative `activities.cost`/`duration_hours`, `expenses.amount`, `cities.popularity_score`/`cost_index`

### Global travel support (added in `add_global_travel_and_currency_fields`)

- `cities.country_code` (`CHAR(2)`), `cities.latitude`/`cities.longitude` (`DECIMAL(9,6)`), `cities.timezone` (`VARCHAR(64)`, IANA identifier e.g. `Europe/Paris`, `Asia/Kolkata`, `Asia/Makassar`) — all `NOT NULL`, indexed via `@@index([countryCode])`.
- `activities.currency_code` and `expenses.currency_code` (`CHAR(3)`, ISO-style e.g. `EUR`, `USD`, `INR`) — plain strings, **not** a DB enum, so new currencies never require a migration.
- `id` stays `Int`/autoincrement everywhere (not UUID) — the Express API is expected to expose ids as strings and convert at the repository boundary (`Number(id)` on the way in, `String(id)` on the way out).

## 9. Important IDs / relationships for API integration

- **Auth**: `users.password_hash` stores a bcrypt hash — never plain text. `users.role` is `USER` or `ADMIN`.
- **Multi-city trips**: order cities within a trip via `trip_stops.stop_order` (1, 2, 3, …).
- **Day-wise itinerary**: query `itinerary_items` filtered by `trip_id`, grouped by `activity_date`, ordered by `item_order` — there's a composite index `(trip_id, activity_date, item_order)` for this.
- **Budget breakdown**: `SELECT category, SUM(amount) FROM expenses WHERE trip_id = ? GROUP BY category` gives the category breakdown; sum without `GROUP BY` gives the trip total. Average cost/day = total ÷ `DATEDIFF(end_date, start_date) + 1`.
- **Public sharing**: create a row in `trip_shares` with a random `share_token` (e.g. `crypto.randomBytes(24).toString('hex')`); look up shared trips by token, not by trip id, and check `is_active` and `expires_at`.
- **Saved destinations**: a many-to-many via the `saved_destinations` join table; look up/insert/delete by `(user_id, city_id)`.

## 10. How your backend connects

1. `npm install` inside `server/` (installs `@prisma/client`, `bcrypt`, etc. — already in `server/package.json`)
2. Import the generated client: `import { PrismaClient } from '@prisma/client'`
3. Use `DATABASE_URL` from `.env` (already wired via `prisma/schema.prisma`'s `datasource` block)
4. Never query MySQL directly from Express — go through Prisma Client so schema changes stay centralized in `prisma/schema.prisma`

## Demo credentials (seed data)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@globetrotter.app` | `Admin@123` |
| User | `demo@globetrotter.app` | `Demo@123` |

These are bcrypt-hashed in the database — the plain-text values above are
only for logging in during development.
