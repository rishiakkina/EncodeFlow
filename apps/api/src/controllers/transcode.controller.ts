import type { Request, Response } from "express";
import { getTranscodeJob } from "../services/transcode.service";

export function handleGetTranscodeJob(req: Request, res: Response) {
  const { jobId } = req.params as { jobId: string };
  const job = getTranscodeJob(jobId);
  return res.json(job);
}

