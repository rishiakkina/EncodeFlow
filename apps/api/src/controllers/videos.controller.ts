import type { Request, Response } from "express";
import {
  getVideo,
  getVideoStatus,
  listVideos,
} from "../services/videos.service";

export function handleListVideos(req: Request, res: Response) {
  const limit = Math.max(1, Math.min(50, Number(req.query.limit ?? 10)));
  const result = listVideos(limit);
  return res.json(result);
}

export function handleGetVideo(req: Request, res: Response) {
  const { videoId } = req.params as { videoId: string };
  const video = getVideo(videoId);
  return res.json({ video });
}

export function handleGetVideoStatus(req: Request, res: Response) {
  const { videoId } = req.params as { videoId: string };
  const status = getVideoStatus(videoId);
  return res.json(status);
}

