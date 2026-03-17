
import {
  Download,
  MoreHorizontal,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

type PageProps = {
  params: Promise<{ videoId: string }>;
};

function makeVideoTitle(videoId: string) {
  const base = [
    "Serverless Framework with Node.js",
    "Building a scalable API",
    "Microservices for beginners",
    "React + Next.js UI walkthrough",
    "Designing a YouTube-like layout",
  ];
  const n = Number.parseInt(videoId, 10);
  const pick = Number.isFinite(n) ? n : videoId.length;
  return `${base[pick % base.length]} — video ${videoId}`;
}

function makeStats(videoId: string) {
  const n = Math.max(1, Number.parseInt(videoId, 10) || videoId.length);
  const views = `${(n * 137_421) % 9_900_000}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const years = (n % 5) + 1;
  return { views: `${views} views`, timeAgo: `${years} year${years === 1 ? "" : "s"} ago` };
}

const recommended = Array.from({ length: 12 }).map((_, idx) => ({
  id: idx + 1,
  title: `Recommended video title that can wrap to two lines ${idx + 1}`,
  channel: `Channel ${idx + 1}`,
  views: `${(10 + idx) * 12}K views`,
  timeAgo: `${idx + 1} day${idx === 0 ? "" : "s"} ago`,
  duration: `${8 + (idx % 5)}:${(idx * 7) % 60}`.replace(/:(\d)$/, ":0$1"),
}));

const comments = Array.from({ length: 7 }).map((_, idx) => ({
  id: idx + 1,
  user: `User ${idx + 1}`,
  timeAgo: `${idx + 1} ${idx === 0 ? "hour" : "hours"} ago`,
  text:
    "Nice breakdown — this is exactly the kind of real-world explanation that makes the concept click.",
  likes: 12 + idx * 4,
}));

export default async function VideoByIdPage({ params }: PageProps) {
  const { videoId } = await params;
  const title = makeVideoTitle(videoId);
  const stats = makeStats(videoId);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Watch layout */}
      <section className="px-4 py-4">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Left: player + meta + comments */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="aspect-video bg-linear-to-tr from-zinc-800 via-zinc-900 to-zinc-950" />
            </div>

            <div className="space-y-2">
              <h1 className="text-base sm:text-lg font-semibold leading-snug">
                {title}
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
                <div className="text-xs text-zinc-300 font-semibold">
                  {stats.views} • {stats.timeAgo}
                </div>
                <p className="mt-2 text-sm text-zinc-200 leading-relaxed">
                  You are watching video <span className="font-semibold">#{videoId}</span>.
                  This is mock data for now — later we can load real video content using this id.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">
                  {comments.length} Comments
                </h2>
              </div>

              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-zinc-800 shrink-0" />
                <div className="flex-1">
                  <input
                    className="w-full bg-transparent border-b border-zinc-800 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-zinc-600"
                    placeholder="Add a comment..."
                    type="text"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="h-9 w-9 rounded-full bg-zinc-800 shrink-0" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-zinc-200">
                          {c.user}
                        </span>
                        <span className="text-zinc-500">{c.timeAgo}</span>
                      </div>
                      <p className="text-sm text-zinc-200 leading-relaxed">
                        {c.text}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-zinc-400">
                        <button className="inline-flex items-center gap-1 text-xs hover:text-zinc-200">
                          <ThumbsUp className="h-4 w-4" />
                          {c.likes}
                        </button>
                        <button className="inline-flex items-center gap-1 text-xs hover:text-zinc-200">
                          <ThumbsDown className="h-4 w-4" />
                        </button>
                        <button className="text-xs hover:text-zinc-200">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                <article key={v.id} className="flex gap-3">
                  <div className="relative w-40 overflow-hidden rounded-lg bg-zinc-800 shrink-0">
                    <div className="aspect-video bg-linear-to-tr from-zinc-700 via-zinc-800 to-zinc-900" />
                    <span className="absolute bottom-1 right-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-zinc-900/90">
                      {v.duration}
                    </span>
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                      {v.title}
                    </h3>
                    <p className="text-xs text-zinc-400">{v.channel}</p>
                    <p className="text-[11px] text-zinc-500">
                      {v.views} • {v.timeAgo}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

