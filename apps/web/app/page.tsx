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

async function getVideos(): Promise<Video[]> {
  const { data } = await axios.get<ListVideosResponse>(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
  return data.items;
}

export default async function Page() {
  const videos = await getVideos();
  console.log(videos);
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Content */}
      <section className="px-4 pt-3 pb-6 space-y-4">
        {/* Video grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <Link href={`/video/${video.videoId}`} key={video.videoId} className="space-y-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-800">
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
                  <div className="absolute inset-0 bg-linear-to-tr from-zinc-700 via-zinc-800 to-zinc-900" />
                )}
                <span className="absolute bottom-1 right-1 z-10 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-zinc-900/90">
                  {video.videoDuration}
                </span>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-9 w-9 shrink-0 rounded-full bg-zinc-800" />
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold leading-snug line-clamp-2">
                    {video.videoTitle}
                  </h2>
                  <p className="text-xs text-zinc-400">{video.videoChannel}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
