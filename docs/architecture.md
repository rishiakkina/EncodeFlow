# Architecture

EncodeFlow is a turborepo monorepo for video ingest, cloud storage, transcoding, and (eventually) adaptive playback.

## Applications

- **`apps/web`** — Next.js UI. The upload flow calls the API, then PUTs the file to S3 using the presigned URL.
- **`apps/api`** — Express API: creates upload sessions, completes uploads, and (planned) lists videos and serves playback metadata.

## Packages

- **`@repo/db`** — Prisma schema and client (Postgres). Models: `User`, `Video`, `VideoRendition`, `TranscodeJob`, `UploadSession`.
- **`@repo/s3`** — AWS S3 client helpers: presigned PUT/GET URLs for browser/direct uploads and reads.
- **`@repo/redis`** — Redis client; publishes transcode requests to a stream (`encodeflow:transcode`) after upload completion.

## Request flow (upload → queue)

1. Client calls `POST /upload-sessions` to obtain upload metadata and a presigned PUT URL.
2. Client uploads bytes to S3 with `PUT`.
3. Client calls `POST /upload-sessions/:id/complete` with `s3Key` (and optional `etag` / `sizeBytes`).
4. API appends a job payload to the Redis stream for workers to consume (encoding details live in the payload).

## Not wired yet

- Workers that read the Redis stream and write renditions back to S3.
- Durable persistence of sessions and job state in Postgres for most read paths.
- Authn/authz and signed playback URLs.

## Local ports

- API: `http://localhost:3000` (default `PORT`)
- Web: `http://localhost:3001`
