import {
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { VideoPlayer } from "../../../components/video-player";
import axios from "axios";  
import Image from "next/image";

type PageProps = {
  params: Promise<{ videoId: string }>;
};

export type Video = {
  videoId: string;
  videoTitle: string;
  videoChannel: string;
  videoDescription: string; 
  videoDuration: number;
  videoThumbnail?: string;
};


async function getVideoById(videoId: string): Promise<Video> {
  const { data } = await axios.get<Video>(`${process.env.NEXT_PUBLIC_API_URL}/videos/${videoId}`);
  return data;
} 

async function getRecommendedVideos(videoId: string): Promise<Video[]> {
  const { data } = await axios.get<Video[]>(`${process.env.NEXT_PUBLIC_API_URL}/videos/recommended/${videoId}?limit=5`);
  return data;
}

export default async function VideoByIdPage({ params }: PageProps) {
  const { videoId } = await params;
  const video = await getVideoById(videoId);
  const hlsUrl = `${process.env.CDN_URL}/${videoId}/master.m3u8`;
  const recommended = await getRecommendedVideos(videoId);
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Watch layout */}
      <section className="px-4 py-4">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Left: player + meta */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
              <VideoPlayer src={hlsUrl} />
            </div>

            <div className="space-y-2">
              <h1 className="text-base sm:text-lg font-semibold leading-snug">
                {video.videoTitle}
              </h1>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800" />
                  <div className="leading-tight">
                    <div className="font-semibold text-sm">EncodeFlow Labs</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex overflow-hidden rounded-full border border-zinc-700 bg-zinc-900">
                    <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-zinc-800">
                      <ThumbsUp className="h-4 w-4" />
                      22K
                    </button>
                    <div className="w-px bg-zinc-700" />
                    <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold hover:bg-zinc-800">
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>

                  <button className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-semibold hover:bg-zinc-800">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm">
                <p className="mt-2 text-sm text-zinc-200 leading-relaxed">
                  {video.videoDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Right: recommended list */}
          <aside className="space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:hidden">
              {["All", "Related", "Recently uploaded", "Watched"].map((t) => (
                <button
                  key={t}
                  className="whitespace-nowrap rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {recommended.map((v) => (
                <Link href={`/video/${v.videoId}`} key={v.videoId}>
                  <article className="flex gap-3">
                    <div className="relative w-40 overflow-hidden rounded-lg bg-zinc-800 shrink-0">
                      {v.videoThumbnail ? (
                        <Image src={v.videoThumbnail} alt={v.videoTitle} fill className="object-cover" />
                      ) : (
                        <div className="aspect-video bg-linear-to-tr from-zinc-700 via-zinc-800 to-zinc-900" />
                      )}
                      <span className="absolute bottom-1 right-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-zinc-900/90">
                        {v.videoDuration}
                      </span>
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                        {v.videoTitle}
                      </h3>
                      <p className="text-xs text-zinc-400">{v.videoChannel}</p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

