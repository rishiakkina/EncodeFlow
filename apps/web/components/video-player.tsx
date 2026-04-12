"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

type VideoPlayerProps = {
  src: string;
};

export function VideoPlayer({ src }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const videoEl = document.createElement("video");
    videoEl.className = "video-js vjs-big-play-centered";
    videoEl.setAttribute("playsInline", "true");
    videoEl.setAttribute("webkit-playsinline", "true");
    container.appendChild(videoEl);

    const player = videojs(videoEl, {
      controls: true,
      autoplay: true,
      preload: "auto",
      fluid: true,
      sources: [{ src, type: "application/vnd.apple.mpegurl" }],
    });

    return () => {
      player.dispose();
    };
  }, [src]);

  return <div ref={containerRef} className="w-full" data-vjs-player />;
}
