# Booking API

> A production-style appointment booking REST API with conflict detection — built with NestJS, TypeScript, PostgreSQL and Prisma.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black)

## 🎯 Problem

Businesses that take appointments (clinics, salons, consultants) constantly deal with double bookings when scheduling is manual. This API solves that: it validates every booking request and **automatically rejects any appointment that overlaps** with an existing confirmed one.

## ✨ Features

- **Create appointments** with full input validation (`class-validator`)
- **Overlap detection** — returns `409 Conflict` when a time slot is already taken
- **Time integrity checks** — rejects appointments where `endTime <= startTime`
- **List, view, and cancel** appointments
- **PostgreSQL persistence** with Prisma ORM — data survives restarts
- **Interactive API docs** with Swagger (`/api`)
- **Global validation pipe** with whitelist + `forbidNonWhitelisted` (unknown fields are rejected)

## 📸 API Documentation

Interactive Swagger UI available at `/api`:

![Swagger UI](IMG_1510.png)


## 🛠️ Tech Stack

NestJS · TypeScript · PostgreSQL · Prisma · class-validator / class-transformer · Swagger (OpenAPI 3) · Docker

## 🚀 Quick Start

```bash
# install dependencies
npm install

# start PostgreSQL (Docker)
bash setup-db.sh

# apply database migrations
npx prisma migrate dev

# run in watch mode
npm run start:dev
```

The API starts on `http://localhost:3000` — Swagger docs at `http://localhost:3000/api`.

Environment: create a `.env` file with:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/booking"
```

## 📡 Endpoints

| Method | Route                | Description                          |
|--------|----------------------|--------------------------------------|
| POST   | `/appointments`      | Book a new appointment               |
| GET    | `/appointments`      | List all appointments                |
| GET    | `/appointments/:id`  | Get one appointment                  |
| DELETE | `/appointments/:id`  | Cancel an appointment                |

### Example — booking an appointment

```bash
curl -X POST http://localhost:3000/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Ahmed",
    "clientEmail": "ahmed@test.com",
    "startTime": "2026-07-15T10:00:00Z",
    "endTime": "2026-07-15T11:00:00Z"
  }'
```

### Example — conflict response (409)

```json
{
  "message": "Time slot overlaps with appointment #1",
  "error": "Conflict",
  "statusCode": 409
}
```

## 🏗️ Design Notes

- **Overlap algorithm**: two time ranges `[startA, endA)` and `[startB, endB)` overlap if and only if `startA < endB && endA > startB`. This single condition catches every overlap case (partial, contained, identical). The check runs as a single Prisma `findFirst` query.
- **DTO-first validation**: all input rules live in `CreateAppointmentDto`, enforced globally by a `ValidationPipe`, so controllers and services never receive malformed data.
- **Prisma schema as source of truth**: the `Appointment` model lives in `prisma/schema.prisma`, with versioned migrations under `prisma/migrations/`.

## 📊 What I'd improve for production

- **Concurrency safety** — a database exclusion constraint on time ranges, since the application-level check has a race condition under parallel requests
- **Authentication** (JWT) so clients can only manage their own appointments
- **Pagination & filtering** on the list endpoint (by date range, by status)
- **Tests** — unit tests for the overlap logic and e2e tests for the endpoints (Jest + Supertest)
- **Docker Compose** setup for one-command local development (API + DB together)

## 👤 Author

**Abdelaziz Debbabi** — Fullstack Developer (Node.js/NestJS · PostgreSQL · React)

