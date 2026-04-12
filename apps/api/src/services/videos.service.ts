import { randomUUID } from "crypto";
import client from "@repo/db";
export type VideoStatus = "UPLOADING" | "PROCESSING" | "READY" | "FAILED";

export type Video = {
  videoId: string;
  videoTitle: string;
  videoChannel: string;
  videoDescription: string;
  videoDuration: number;
};

export type ListVideosResult = {
  items: Array<Video>;
  pageInfo: {
    nextCursor: string | null;
  };
};

export async function listVideos(limit: number): Promise<ListVideosResult> {
  // TODO: Authenticate and list videos for the authenticated user.
  const videos = await client.video.findMany({
    where: {
      status: "READY",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
  return {
    items: videos.map((video) => ({
      videoId: video.videoId,
      videoTitle: video.title,
      videoChannel: video.videoChannel,
      videoDescription: video.description,
      videoDuration: video.durationSeconds,
    })),
    pageInfo: { nextCursor: null },
  };
}

export async function getVideo(videoId: string): Promise<Video> {
  const video = await client.video.findUnique({
    where: {
      videoId: videoId,
    },
  });
  if (!video) {
    throw new Error("Video not found");
  }
  return {
    videoId: video.videoId,
    videoTitle: video.title,
    videoChannel: video.videoChannel,
    videoDescription: video.description,
    videoDuration: video.durationSeconds,
  };
}

export async function getRecommendedVideos(limit: number, excludeVideoId: string): Promise<Video[]> {
  const videos = await client.video.findMany({
    where: {
      videoId: {
        not: excludeVideoId,
      },
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });
  return videos.map((video) => ({
    videoId: video.videoId,
    videoTitle: video.title,
    videoChannel: video.videoChannel,
    videoDescription: video.description,
    videoDuration: video.durationSeconds,
  }));
}
