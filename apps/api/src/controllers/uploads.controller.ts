import type { Request, Response } from "express";
import {
  completeUploadSession,
  createUploadSession,
  getUploadSessionState,
} from "../services/uploads.service";
import dotenv from "dotenv";
dotenv.config();

type CreateUploadSessionBody = {
  filename: string;
  contentType: string;
};

type CompleteUploadSessionBody = {
  s3Key: string;
  etag?: string;
  sizeBytes?: number;
};

export async function handleCreateUploadSession(req: Request, res: Response) {
  const body = req.body as CreateUploadSessionBody;

  const missing =
    !body.filename ||
    !body.contentType;

  if (missing) {
    return res.status(400).json({
      error: "invalid_request",
      message: "Expected { filename, contentType, sizeBytes }",
    });
  }

  try {
    const result = await createUploadSession({
      filename: body.filename,
      contentType: body.contentType,
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "upload_session_creation_failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export function handleGetUploadSession(req: Request, res: Response) {
  const { uploadSessionId } = req.params as { uploadSessionId: string };
  const state = getUploadSessionState(uploadSessionId);

  return res.json(state);
}

export async function handleCompleteUploadSession(req: Request, res: Response) {
  const { uploadSessionId } = req.params as { uploadSessionId: string };
  const body = req.body as CompleteUploadSessionBody;

  if (!body.s3Key) {
    return res.status(400).json({
      error: "invalid_request",
      message: "Expected { s3Key }",
    });
  }

  const result = await completeUploadSession(uploadSessionId, {
    s3Key: body.s3Key,
    etag: body.etag,
    sizeBytes: body.sizeBytes,
  });

  return res.status(202).json(result);
}

