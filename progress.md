## 2026-04-01

### Done

- Documented repo layout and integrations in README and `docs/` (architecture + API overview).
- Confirmed upload completion path enqueues work to Redis stream `encodeflow:transcode` via `@repo/redis`.
- Confirmed S3 presigned PUT generation lives in `@repo/s3` and uses `AWS_BUCKET_NAME` (and standard AWS credential env vars).

### In Progress

- End-to-end upload: API `createUploadSession` currently returns only the presigned URL string while `apps/web` expects a structured body (`upload.url`, `uploadSessionId`, `s3Key`) — response shape needs alignment.
- Persist upload sessions, videos, transcode jobs, and renditions with Prisma (`@repo/db`) instead of placeholders.
- Playback manifests and signed CDN URLs (`playback.service.ts` still TODO).
- Video listing and job status (`videos.service.ts`, `transcode.service.ts` still TODO / mocked patterns).

### Blockers

- None tracked in-repo beyond missing env/config for local runs (`DATABASE_URL`, `REDIS_URL`, AWS credentials, bucket) and the API/web contract mismatch above.
