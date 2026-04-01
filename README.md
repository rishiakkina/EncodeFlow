# EncodeFlow

Monorepo for encoding workflows: upload → transcode jobs → playback manifests.

## What's in this repo

- **`apps/api`** — Express + TypeScript API
- **`apps/web`** — Next.js web UI
- **`packages/db`** — Prisma/Postgres (`User`, `Video`, `UploadSession`, `TranscodeJob`, `VideoRendition`)
- **`packages/s3`** — AWS S3 client and presigned PUT/GET URL helpers
- **`packages/redis`** — Redis client; transcode requests are pushed to stream `encodeflow:transcode`
- Shared tooling: `@repo/eslint-config`, `@repo/typescript-config`, `@repo/tailwind-config`

## Development setup

Requirements:

- Node.js >= 18
- PostgreSQL (`DATABASE_URL` for Prisma)
- Redis (`REDIS_URL` for enqueueing transcode work after upload complete)
- AWS credentials and an S3 bucket for presigned uploads (`AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET_NAME`)

1. Install dependencies:

```sh
npm install
```

2. Configure environment:

- **`packages/db`** — `DATABASE_URL` (e.g. in `packages/db/.env`; loaded via `dotenv`).
- **`apps/api`** / **`packages/s3`** / **`packages/redis`** — set `REDIS_URL`, `AWS_*`, and `AWS_BUCKET_NAME` where the processes run (e.g. repo `.env` or shell).

## Run locally

Start both the API and the web app:

```sh
npm run dev
```

Endpoints:

- API: `http://localhost:3000`
- Web: `http://localhost:3001`

## API endpoints

The API is mounted on the Express app in `apps/api`. See **`docs/api.md`** for a concise reference.

Health:

- `GET /healthz` → `{ ok: true }`
- `GET /` → `{ name: "encodeflow-api", status: "ok" }`

Upload sessions:

- `POST /upload-sessions`
  - Body: `{ filename: string, contentType: string }`
  - **Current behavior:** the service returns a **presigned PUT URL string**; the JSON body shape should be expanded to match client expectations (the web app expects `upload.url`, `uploadSessionId`, `s3Key`, etc.).
- `GET /upload-sessions/:uploadSessionId`
  - Stub: status is not yet loaded from DB/Redis.
- `POST /upload-sessions/:uploadSessionId/complete`
  - Body: `{ s3Key: string, etag?: string, sizeBytes?: number }`
  - Enqueues a transcode request on the Redis stream (see **`docs/architecture.md`**).

Videos, job status, and playback routes exist but may still use mocks or TODOs until wired to Postgres/Redis and CDN signing — check `apps/api/src/services/*.ts`.

## Database (Prisma)

Schema: `packages/db/prisma/schema.prisma`.

```sh
cd packages/db
npm run db:migrate
```

## Docs

- **`docs/architecture.md`** — components and upload-to-queue flow
- **`docs/api.md`** — endpoint overview and current caveats

## Current focus

- Align **`POST /upload-sessions`** response with the web client (and optionally persist the session in Prisma).
- Replace stubs with DB-backed reads and real job/playback state.
- Implement workers that consume the Redis transcode stream and write renditions to S3.
