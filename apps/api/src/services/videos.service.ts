import { randomUUID } from "crypto";
import client from "@repo/db/client";

export type VideoStatus = "UPLOADING" | "PROCESSING" | "READY" | "FAILED";

export type Video = {
  id: string;
  status: VideoStatus;
  createdAt: string;
};

export type ListVideosResult = {
  items: Array<Video>;
  pageInfo: {
    nextCursor: string | null;
  };
};

export function listVideos(limit: number): ListVideosResult {
  // TODO: Authenticate and list videos for the authenticated user.
  return {
    items: Array.from({ length: limit }).map(() => ({
      id: randomUUID(),
      status: "READY",
      createdAt: new Date().toISOString(),
    })),
    pageInfo: { nextCursor: null },
  };
}

export function getVideo(videoId: string): Video {
  // TODO: Fetch from DB and include renditions + playback metadata when ready.
  return {
    id: videoId,
    status: "PROCESSING",
    createdAt: new Date().toISOString(),
  };
}

export function getVideoStatus(videoId: string): { videoId: string; status: VideoStatus } {
  // TODO: Return per-rendition states and job progress if you track it.
  return { videoId, status: "PROCESSING" };
}

