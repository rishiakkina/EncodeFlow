import type { Request, Response } from "express";
import {
  completeUploadSession,
  createUploadSession,
} from "../services/uploads.service";
import dotenv from "dotenv";
dotenv.config();

type CreateUploadSessionBody = {
  filename: string;
  sizeBytes: number;
  videoChannel: string;
  title: string;
  description: string;
  durationSeconds: number;
};

export async function handleCreateUploadSession(req: Request, res: Response) {
  const body = req.body as CreateUploadSessionBody;

  try {
    const result = await createUploadSession({
      filename: body.filename,
      sizeBytes: body.sizeBytes,
      videoChannel: body.videoChannel,
      title: body.title,
      description: body.description,
      durationSeconds: body.durationSeconds,
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "upload_session_creation_failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}


export async function handleCompleteUploadSession(req: Request, res: Response) {
  const { uploadSessionId } = req.params as { uploadSessionId: string };
  const { videoId } = req.body as { videoId: string };

  const result = await completeUploadSession(uploadSessionId, videoId);

  return res.status(202).json(result);
}

