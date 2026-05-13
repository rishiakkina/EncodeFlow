"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Search, Upload, User, Video, X } from "lucide-react";
import axios from "axios";
import Image from "next/image";

export function AppHeader() {
  const dialogTitleId = useId();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const nameInputRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    if (!isCreateOpen) return;
    window.setTimeout(() => nameInputRef.current?.focus(), 0);
  }, [isCreateOpen]);

  const canUpload = Boolean(videoFile) && name.trim().length > 0;

  const closeAndReset = () => {
    setIsCreateOpen(false);
    setVideoFile(null);
    setName("");
    setDescription("");
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/90 px-5 py-3 backdrop-blur">
        <Link href="/" className="flex items-center gap-2">
          <Image width="36" height="36" src="/logo.png" alt="EncodeFlow"/>
          <div className="flex flex-col leading-[1.1]">
            <span className="text-lg font-semibold tracking-tight text-zinc-100">
              EncodeFlow
            </span>
          </div>
        </Link>

        <div className="flex max-w-xl flex-1 items-center px-5">
          <div className="flex w-full overflow-hidden rounded-xl border border-zinc-800/70 bg-zinc-900">
            <input
              className="h-9 w-full bg-transparent px-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
              placeholder="Search"
              type="text"
            />
            <button className="flex h-9 items-center justify-center border-l border-zinc-800/70 px-3 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex h-9 items-center justify-center gap-2 rounded-xl border border-zinc-800/70 bg-zinc-900 px-3 text-zinc-200 transition-colors hover:bg-zinc-800"
            type="button"
          >
            <Video className="h-4 w-4" />
            <span className="hidden text-sm font-medium sm:inline">Create</span>
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800/70 bg-zinc-900 text-zinc-200 transition-colors hover:bg-zinc-800"
            type="button"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </header>

      {isCreateOpen ? (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
        >
          <button
            className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={closeAndReset}
            aria-label="Close"
            type="button"
          />

          <div className="relative mx-auto mt-16 w-[min(92vw,520px)] rounded-2xl border border-zinc-800/70 bg-zinc-950 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-3">
              <h2 id={dialogTitleId} className="text-sm font-semibold text-zinc-100">
                Upload video
              </h2>
              <button
                onClick={closeAndReset}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-900"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-4 py-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">
                  Video file
                </label>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-zinc-700/80 bg-zinc-900 px-3 py-3 hover:bg-zinc-800">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-zinc-100">
                      {videoFile ? videoFile.name : "Choose a file"}
                    </div>
                    <div className="text-xs text-zinc-500">
                      MP4 only
                    </div>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-950 text-zinc-300">
                    <Upload className="h-4 w-4" />
                  </div>
                  <input
                    className="hidden"
                    type="file"
                    accept="video/mp4"
                    onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">
                  Name
                </label>
                <input
                  ref={nameInputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-zinc-700/80 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-500"
                  placeholder="Video name"
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[96px] w-full resize-none rounded-xl border border-zinc-700/80 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-500"
                  placeholder="Describe your video"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-zinc-800/70 px-4 py-3">
              <button
                onClick={closeAndReset}
                className="h-9 rounded-xl border border-zinc-700/80 bg-zinc-900 px-4 text-sm font-semibold text-zinc-200 hover:bg-zinc-800"
                type="button"
              >
                Cancel
              </button>
              <button
                disabled={!canUpload}
                onClick={async () => {
                  const apiBase = process.env.NEXT_PUBLIC_API_URL;
                  const response = await axios.post(`${apiBase}/upload-sessions`, {
                    filename: videoFile?.name ?? "",
                    sizeBytes: videoFile?.size,
                    title: name.trim(),
                    description: description.trim(),
                    videoChannel: "EncodeFlow Labs",
                    durationSeconds: 0,
                  });
                  await axios.put(response.data.url, videoFile, {
                    headers: {
                      "Content-Type": "video/mp4",
                    },
                  });
                  await axios.post(`${apiBase}/upload-sessions/${response.data.uploadSessionId}/complete`, { videoId: response.data.videoId });
                  closeAndReset();
                }}
                className="h-9 rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

