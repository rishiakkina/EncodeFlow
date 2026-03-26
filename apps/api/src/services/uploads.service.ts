import { randomUUID } from "crypto";

export type CreateUploadSessionResult = {
  uploadSessionId: string;
  videoId: string;
  upload: {
    method: "PUT";
    url: string;
    headers: Record<string, string>;
  };
};

export type UploadSessionState = {
  uploadSessionId: string;
  status: "READY_FOR_UPLOAD" | "UPLOADING" | "COMPLETED" | "FAILED";
};

export function createUploadSession(input: {
  filename: string;
  contentType: string;
  sizeBytes: number;
  visibility?: "PUBLIC" | "UNLISTED" | "PRIVATE";
}): CreateUploadSessionResult {
  const uploadSessionId = randomUUID();
  const videoId = randomUUID();

  // TODO: Create DB rows for the upload session + video.
  // TODO: Generate S3 pre-signed URL(s) for single-file upload.
  void input;

  return {
    uploadSessionId,
    videoId,
    upload: {
      method: "PUT",
      url: "TODO_S3_PRESIGNED_URL",
      headers: {},
    },
  };
}

export function getUploadSessionState(uploadSessionId: string): UploadSessionState {
  // TODO: Look up session state in DB/Redis.
  return {
    uploadSessionId,
    status: "READY_FOR_UPLOAD",
  };
}

export function completeUploadSession(
  uploadSessionId: string,
  input: { s3Key: string; etag?: string; sizeBytes?: number },
): {
  uploadSessionId: string;
  videoId: string;
  jobIds: string[];
  status: "ENQUEUED";
} {
  // TODO: Validate/ffprobe input and write initial metadata to DB.
  // TODO: Enqueue transcode job into Redis.
  void input;

  const videoId = randomUUID();
  const jobId = randomUUID();

  return {
    uploadSessionId,
    videoId,
    jobIds: [jobId],
    status: "ENQUEUED",
  };
}

