# API reference (overview)

Base URL in development: `http://localhost:3000`. Routes are mounted on the Express app in `apps/api`.

## Health

| Method | Path | Response |
|--------|------|----------|
| `GET` | `/` | `{ name: "encodeflow-api", status: "ok" }` |
| `GET` | `/healthz` | `{ ok: true }` |

## Upload sessions

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/upload-sessions` | Create session and obtain S3 presigned PUT URL (requires `AWS_BUCKET_NAME` and AWS credentials). |
| `GET` | `/upload-sessions/:uploadSessionId` | Session state (currently stubbed; always `READY_FOR_UPLOAD`). |
| `POST` | `/upload-sessions/:uploadSessionId/complete` | Confirm object in S3; enqueues transcode request on Redis stream. |

### `POST /upload-sessions`

**Body:** `{ filename: string, contentType: string }` (validator message still mentions `sizeBytes` in some errors; optional body fields may be added later.)

**Behavior today:** Handler returns whatever `createUploadSession` resolves to. The service currently resolves to a **string** (the presigned URL). A structured contract with `uploadSessionId`, `videoId`, `s3Key`, and nested `upload.url` is the intended shape for clients aligned with the web app.

### `POST /upload-sessions/:uploadSessionId/complete`

**Body:** `{ s3Key: string, etag?: string, sizeBytes?: number }`

**Response:** `202` with `{ uploadSessionId, videoId, jobIds, status: "ENQUEUED" }`. Job IDs are generated in-process; full persistence and validation (e.g. ffprobe) are still TODO in the service layer.

## Videos

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/videos` | Listed in README; implementation may still be mock/TODO — verify `videos.service.ts`. |
| `GET` | `/videos/:videoId` | Same as above. |
| `GET` | `/videos/:videoId/status` | Same as above. |

## Transcode jobs

| Method | Path | Notes |
| `GET` | `/transcode-jobs/:jobId` | Intended for job status; may read Redis/DB when implemented — verify `transcode.service.ts`. |

## Playback

| Method | Path | Notes |
| `GET` | `/playback/:videoId/manifest` | Returns manifest metadata; real signed `masterPlaylistUrl` is still TODO. |
