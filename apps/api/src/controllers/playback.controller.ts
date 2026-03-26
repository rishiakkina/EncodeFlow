import type { Request, Response } from "express";
import { getPlaybackManifest } from "../services/playback.service";

export function handleGetPlaybackManifest(req: Request, res: Response) {
  const { videoId } = req.params as { videoId: string };
  const manifest = getPlaybackManifest(videoId);
  return res.json(manifest);
}

