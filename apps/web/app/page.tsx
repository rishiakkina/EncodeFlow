import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Video } from "./video/[videoId]/page";

type ListVideosResponse = {
  items: Video[];
  pageInfo: {
    nextCursor: string | null;
  };
};

const apiBaseUrl = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

async function getVideos(): Promise<Video[]> {
  const { data } = await axios.get<ListVideosResponse>(`${apiBaseUrl}/videos`);
  return data.items;
}

export default async function Page() {
  const videos = await getVideos();
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Content */}
      <section className="space-y-6 px-5 pb-8 pt-6">
        <div className="flex items-end justify-between">
          <h1 className="text-base font-semibold tracking-tight">Recent videos</h1>
          <span className="text-xs text-zinc-500">{videos.length} items</span>
        </div>
        {/* Video grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <Link href={`/video/${video.videoId}`} key={video.videoId} className="space-y-3">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                {video.videoThumbnail ? (
                  <Image
                    src={video.videoThumbnail}
                    alt={video.videoTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-tr from-zinc-800 via-zinc-900 to-black" />
                )}
                <span className="absolute bottom-2 right-2 z-10 rounded bg-zinc-900/85 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-50">
                  {video.videoDuration}
                </span>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-9 w-9 shrink-0 rounded-full border border-zinc-800 bg-zinc-900" />
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold leading-snug line-clamp-2">
                    {video.videoTitle}
                  </h2>
                  <p className="text-xs text-zinc-500">{video.videoChannel}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
