import { randomUUID } from "crypto";
import { getPresignedPutUrl, s3Client } from "@repo/s3";
import { xAddTranscodeRequest } from "@repo/redis";
import client from "@repo/db";
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
  sizeBytes: number;
  videoChannel: string;
  title: string;
  description: string;
  durationSeconds: number;
}): Promise<CreateUploadSessionResult> {
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
    contentType: "video/mp4",
  });

  console.log("url", url);

  await client.video.create({
    data: {
      videoId,
      videoChannel: input.videoChannel,
      title: input.title,
      description: input.description,
      durationSeconds: input.durationSeconds
    },
  });

  console.log("video created");

  await client.uploadSession.create({
    data: {
      id: uploadSessionId,
      videoId,
      s3Key,
      contentType: "video/mp4",
      sizeBytes: input.sizeBytes,
      originalFilename: input.filename
    },
  });

  return {
    uploadSessionId,
    videoId,
    url,
  };
}


export async function completeUploadSession(
  uploadSessionId: string,
  videoId: string
): Promise<{
  uploadSessionId: string;
  videoId: string;
}> {
  const uploadSession = await client.uploadSession.update({
    where: {
      id: uploadSessionId,
    },
    data: {
      status: "COMPLETED",
    },
  });

  if (!uploadSession.s3Key) {
    throw new Error("Upload session s3Key not found");
  }

  await client.video.update({
    where: {
      videoId,
    },
    data: {
      status: "PROCESSING",
    },
  });

  const outputBaseKey = `videos/${videoId}`;

  await xAddTranscodeRequest(uploadSessionId, uploadSession.s3Key, outputBaseKey);

  return { uploadSessionId, videoId };
}

