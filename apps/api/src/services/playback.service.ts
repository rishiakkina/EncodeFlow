export type PlaybackManifestResult = {
  videoId: string;
  status: "READY" | "NOT_READY" | "FAILED";
  masterPlaylistKey: string;
  masterPlaylistUrl: string;
  qualities: string[];
};

export function getPlaybackManifest(videoId: string): PlaybackManifestResult {
  // TODO: Enforce access control and ensure processed assets exist.
  // TODO: Return CloudFront signed URL/cookie info or a manifest URL.
  void videoId;

  return {
    videoId,
    status: "NOT_READY",
    masterPlaylistKey: `videos/${videoId}/master.m3u8`,
    masterPlaylistUrl: "TODO_CDN_SIGNED_URL",
    qualities: ["1080p", "720p", "480p", "360p"],
  };
}

