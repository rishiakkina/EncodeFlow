import type { Request, Response } from "express";
import {
  getVideo,
  listVideos,
  getRecommendedVideos,
} from "../services/videos.service";

export async function handleListVideos(req: Request, res: Response) {
  const limit = Math.max(1, Math.min(50, Number(req.query.limit ?? 10)));
  const result = await listVideos(limit);
  return res.json(result);
}

export async function handleGetVideo(req: Request, res: Response) {
  const { videoId } = req.params as { videoId: string };
  const video = await getVideo(videoId);
  return res.json(video);
}

export async function handleGetRecommendedVideos(req: Request, res: Response) {
  const { excludeVideoId } = req.params as { excludeVideoId: string };
  const limit = Math.max(1, Math.min(50, Number(req.query.limit ?? 5)));
  const recommended = await getRecommendedVideos(limit, excludeVideoId);
  return res.json(recommended);
}