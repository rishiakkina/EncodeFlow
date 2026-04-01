import { randomUUID } from "crypto";
import { getPresignedPutUrl, s3Client } from "@repo/s3";
import { xAddTranscodeRequest } from "@repo/redis";
import dotenv from "dotenv";
dotenv.config();

export type CreateUploadSessionResult = {
  uploadSessionId: string;
  videoId: string;
  url: string;
};

export type UploadSessionState = {
  uploadSessionId: string;
  status: "READY_FOR_UPLOAD" | "UPLOADING" | "COMPLETED" | "FAILED";
};

export async function createUploadSession(input: {
  filename: string;
  contentType: string;
}): Promise<string> {
  const bucketName = process.env.AWS_BUCKET_NAME?.trim();
  if (!bucketName) {
    throw new Error("Missing AWS_BUCKET_NAME environment variable");
  }

  const videoId = randomUUID();
  const uploadSessionId = randomUUID();

  const s3Key = `uploads/${videoId}.${uploadSessionId}.${input.filename}`;

  console.log("s3Key", s3Key);

  const url = await getPresignedPutUrl(s3Client, {
    bucket: bucketName,
    key: s3Key,
    contentType: input.contentType,
  });

  return url;
}

export function getUploadSessionState(uploadSessionId: string): UploadSessionState {
  // TODO: Look up session state in DB/Redis.
  return {
    uploadSessionId,
    status: "READY_FOR_UPLOAD",
  };
}

export async function completeUploadSession(
  uploadSessionId: string,
  input: { s3Key: string; etag?: string; sizeBytes?: number },
): Promise<{
  uploadSessionId: string;
  videoId: string;
  jobIds: string[];
  status: "ENQUEUED";
}> {
  // TODO: Validate/ffprobe input and write initial metadata to DB.

  const videoId = randomUUID();
  const jobId = randomUUID();
  const createdAtMs = Date.now();
  const outputBaseKey = `videos/${videoId}`;

  await xAddTranscodeRequest({
    jobId,
    videoId,
    uploadSessionId,
    inputKey: input.s3Key,
    outputBaseKey,
    qualities: ["1080p", "720p", "480p"],
    attempt: 0,
    maxAttempts: 5,
    priority: 10,
    createdAtMs,
  });

  return {
    uploadSessionId,
    videoId,
    jobIds: [jobId],
    status: "ENQUEUED",
  };
}

