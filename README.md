# Grand Heist API

Backend API for **Grand Heist**, a tournament game for the SorSU Bulan Campus library.  
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Jorge Kristoffer C. Bono (5h4rky-c0d3z), BSCS 3-2
- Group and game concept: Group 8 - Grand Heist

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```bash
git clone [repository-url]
cd [folder-name]
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```bash
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | PostgreSQL user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Who may call it | Success / errors |
|---|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | Public | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | Public | 200 |
| GET | /results | Finished games, every player, and the top 3. Optional `?since=` | Library Game Hub with valid `X-Hub-Key` | 200 (401 without the key) |

| Verb | URL | Who may call it | What it does | Success / errors |
|---|---|---|---|---|
| GET | /api/v1/question-sets | host | List my question sets | 200 (401, 403) |
| POST | /api/v1/question-sets | host | Create a question set; owner is the caller | 201 (400, 401, 403) |
| GET | /api/v1/question-sets/{id} | host, owner only | Read one | 200 (400, 401, 403, 404) |
| PATCH | /api/v1/question-sets/{id} | host, owner only | Update Question Set Title | 200 (400, 401, 403, 404) |
| DELETE | /api/v1/question-sets/{id} | host, owner only | Delete a set | 204 (400, 401, 403, 404, 409 QUESTION_SET_IN_USE) |
| POST | /api/v1/sessions | host, owner of the set | Create a game session in waiting status; the server makes the six-digit code | 201 (400, 401, 403, 404) |
| GET | /api/v1/sessions/{code} | any known account | Read a game | 200 (400, 401, 404) |
| PATCH | /api/v1/sessions/{code} | host, owner of the question set used by the session | Start or close a game | 200 (400, 401, 403, 404, 409 INVALID_STATUS_CHANGE) |
| POST | /api/v1/sessions/{code}/players | any known account | Join or rejoin a game | 201 new seat, 200 rejoin (400, 401, 404, 409) |
| GET | /api/v1/sessions/{code}/players | any known account | List players and scores | 200 (400, 401, 404) |

Join 409 codes: SESSION_NOT_JOINABLE, SESSION_ENDED, SESSION_FULL, NICKNAME_TAKEN, ALREADY_IN_GAME.

## What "completed" means in my game

A player completed the game if they escaped the vault (`players.status = 'escaped'`). Players who were busted did not complete. A game is finished when `sessions.status = 'ended'`.

## Tables

1. users
2. vault_tiers
3. question_sets
4. questions
5. question_choices
6. sessions
7. players
8. answers
9. reward_offers
10. equipment
11. reward_offer_options
12. beneficial_items
13. defense_items
14. buff_items
15. sabotage_items
16. special_items
17. inventory_items
18. status_effects
19. shop_listings

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |