# EncodeFlow

Monorepo for encoding workflows: upload -> transcode jobs -> playback manifests.

## What's in this repo

- `apps/api`: Express + TypeScript API
- `apps/web`: Next.js web UI
- `packages/db`: Prisma/Postgres data model (User, Video, UploadSession, TranscodeJob, VideoRendition)
- Shared tooling: `@repo/eslint-config`, `@repo/typescript-config`, `@repo/tailwind-config`

## Development setup

Requirements:

- Node.js >= 18
- A PostgreSQL connection string via `DATABASE_URL`

1. Install dependencies:

```sh
npm install
```

2. Configure the database:

- `packages/db` expects `DATABASE_URL` to be available (it loads it via `dotenv/config`).
- You can update `packages/db/.env` or set `DATABASE_URL` in your shell/environment.

## Run locally

Start both the API and the web app:

```sh
npm run dev
```

Endpoints:

- API: `http://localhost:3000`
- Web: `http://localhost:3001`

## API endpoints

The API is mounted at the Express app in `apps/api`.

Health:

- `GET /healthz` -> `{ ok: true }`
- `GET /` -> `{ name: "encodeflow-api", status: "ok" }`

Upload sessions:

- `POST /upload-sessions`
  - Body: `{ filename: string, contentType: string, sizeBytes: number, visibility?: "PUBLIC" | "UNLISTED" | "PRIVATE" }`
  - Response: `{ uploadSessionId, videoId, upload: { method: "PUT", url, headers } }`
  - Note: the S3 pre-signed URL/headers are currently placeholders (`TODO_S3_PRESIGNED_URL`).
- `GET /upload-sessions/:uploadSessionId`
  - Response includes `status` (`READY_FOR_UPLOAD` | `UPLOADING` | `COMPLETED` | `FAILED`)
  - Note: currently returns a placeholder state.
- `POST /upload-sessions/:uploadSessionId/complete`
  - Body: `{ s3Key: string, etag?: string, sizeBytes?: number }`
  - Response: `{ uploadSessionId, videoId, jobIds, status: "ENQUEUED" }`
  - Note: currently returns placeholder values and does not enqueue real jobs yet.

Videos:

- `GET /videos?limit=10`
  - Response: `{ items: Array<{ id, status, createdAt }>, pageInfo: { nextCursor: null } }`
  - Note: currently returns mocked items.
- `GET /videos/:videoId` -> `{ video: { id, status, createdAt } }`
  - Note: currently returns mocked values.
- `GET /videos/:videoId/status` -> `{ videoId, status }`
  - Note: currently returns a mocked status.

Transcode jobs:

- `GET /transcode-jobs/:jobId` -> mocked job state (`UNKNOWN` | `PENDING` | `RUNNING` | `COMPLETED` | `FAILED`)

Playback:

- `GET /playback/:videoId/manifest`
  - Response: `{ videoId, status, masterPlaylistKey, masterPlaylistUrl, qualities }`
  - Note: `masterPlaylistUrl` is currently `TODO_CDN_SIGNED_URL`.

## Database (Prisma)

Prisma schema lives in `packages/db/prisma/schema.prisma`.

Models:

- `User`
- `Video`
- `VideoRendition`
- `TranscodeJob`
- `UploadSession`

To generate migrations locally:

```sh
cd packages/db
npm run db:migrate
```

## Notes on current progress

- The Express API routes exist and validate a few request shapes, but several services are still scaffolding with `TODO` placeholders.
- The Next.js web UI currently renders mock video data and the upload modal is not wired up to the API yet.
