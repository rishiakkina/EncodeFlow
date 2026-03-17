import Link from "next/link";

const categories = [
  "All",
  "Music",
  "Telugu cinema",
  "Mixes",
  "JavaScript",
  "User interface design",
  "Microservices",
  "Bowling",
  "Street food",
  "Masala",
  "Dinners",
  "Live",
  "Pop music",
  "Animated films",
  "Seminars",
  "Tourist destinations",
];

const videos = [
  {
    id: 1,
    title: "I Tried Building an AI... It Actually Worked",
    channel: "Kato",
    views: "15 views",
    timeAgo: "1 day ago",
    duration: "13:52",
  },
  {
    id: 2,
    title: "Pista House Mutton Haleem | First Time in YouTube",
    channel: "Phickchetta Bobby",
    views: "8.9 lakh views",
    timeAgo: "1 year ago",
    duration: "11:22",
  },
  {
    id: 3,
    title: "Mix - Boom Boom | Dude | Pradeep Ranganathan",
    channel: "Udit Narayan, One Piece AMV",
    views: "10 lakh+ views",
    timeAgo: "3 years ago",
    duration: "4:31",
  },
  {
    id: 4,
    title: "India's Air Defense Can Stop Anything – Here's Why",
    channel: "India News",
    views: "44K views",
    timeAgo: "1 day ago",
    duration: "10:37",
  },
  {
    id: 5,
    title: "S/o Satyamurthy Telugu Movie Parts",
    channel: "volgamovie",
    views: "60 lakh views",
    timeAgo: "4 years ago",
    duration: "7:12:39",
  },
  {
    id: 6,
    title: "Mix - melanie martinez - playdate",
    channel: "Melanie Martinez, The Weeknd",
    views: "20 lakh views",
    timeAgo: "2 years ago",
    duration: "3:15",
  },
  {
    id: 7,
    title: "Race Highlights | 2026 Chinese Grand Prix",
    channel: "FORMULA 1",
    views: "21 lakh views",
    timeAgo: "1 day ago",
    duration: "8:14",
  },
  {
    id: 8,
    title: "Mix - Sean Paul - No Lie ft. Dua Lipa",
    channel: "Sean Paul",
    views: "50 lakh views",
    timeAgo: "5 years ago",
    duration: "4:02",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Content */}
      <section className="px-4 pt-3 pb-6 space-y-4">
        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              className="whitespace-nowrap rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Video grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <Link href={`/video/${video.id}`} key={video.id} className="space-y-2">
              <div className="relative w-full overflow-hidden rounded-xl bg-zinc-800">
                <div className="aspect-video bg-linear-to-tr from-zinc-700 via-zinc-800 to-zinc-900" />
                <span className="absolute bottom-1 right-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-zinc-900/90">
                  {video.duration}
                </span>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 h-9 w-9 shrink-0 rounded-full bg-zinc-800" />
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold leading-snug line-clamp-2">
                    {video.title}
                  </h2>
                  <p className="text-xs text-zinc-400">{video.channel}</p>
                  <p className="text-[11px] text-zinc-500">
                    {video.views} • {video.timeAgo}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
