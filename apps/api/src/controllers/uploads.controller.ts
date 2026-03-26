import type { Request, Response } from "express";
import {
  completeUploadSession,
  createUploadSession,
  getUploadSessionState,
} from "../services/uploads.service";

type CreateUploadSessionBody = {
  filename: string;
  contentType: string;
  sizeBytes: number;
  visibility?: "PUBLIC" | "UNLISTED" | "PRIVATE";
};

type CompleteUploadSessionBody = {
  s3Key: string;
  etag?: string;
  sizeBytes?: number;
};

export function handleCreateUploadSession(req: Request, res: Response) {
  const body = req.body as Partial<CreateUploadSessionBody>;

  const missing =
    !body.filename ||
    !body.contentType ||
    typeof body.sizeBytes !== "number";

  if (missing) {
    return res.status(400).json({
      error: "invalid_request",
      message: "Expected { filename, contentType, sizeBytes }",
    });
  }

  // TypeScript doesn't narrow deeply through `Partial<...>` checks,
  // so we assert non-null here after the validation above.
  const filename = body.filename!;
  const contentType = body.contentType!;
  const sizeBytes = body.sizeBytes as number;

  const result = createUploadSession({
    filename,
    contentType,
    sizeBytes,
    visibility: body.visibility,
  });

  return res.status(201).json(result);
}

export function handleGetUploadSession(req: Request, res: Response) {
  const { uploadSessionId } = req.params as { uploadSessionId: string };
  const state = getUploadSessionState(uploadSessionId);

  return res.json(state);
}

export function handleCompleteUploadSession(req: Request, res: Response) {
  const { uploadSessionId } = req.params as { uploadSessionId: string };
  const body = req.body as Partial<CompleteUploadSessionBody>;

  if (!body.s3Key) {
    return res.status(400).json({
      error: "invalid_request",
      message: "Expected { s3Key }",
    });
  }

  const result = completeUploadSession(uploadSessionId, {
    s3Key: body.s3Key,
    etag: body.etag,
    sizeBytes: body.sizeBytes,
  });

  return res.status(202).json(result);
}

