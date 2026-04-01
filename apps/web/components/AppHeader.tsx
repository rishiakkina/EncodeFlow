"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Bell, Mic, Search, Upload, User, Video, X } from "lucide-react";
import axios from "axios";

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
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-2 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs font-semibold">
            EF
          </div>
          <div className="flex flex-col leading-[1.1]">
            <span className="text-lg font-semibold tracking-tight">
              EncodeFlow
            </span>
            <span className="text-[10px] text-zinc-400 -mt-0.5">IN</span>
          </div>
        </Link>

        <div className="flex items-center flex-1 max-w-2xl px-4">
          <div className="flex w-full overflow-hidden rounded-full border border-zinc-700 bg-zinc-900">
            <input
              className="h-9 w-full bg-transparent px-4 text-sm outline-none placeholder:text-zinc-500"
              placeholder="Search"
              type="text"
            />
            <button className="flex h-9 items-center justify-center border-l border-zinc-700 bg-zinc-900/80 px-4 hover:bg-zinc-800">
              <Search className="h-4 w-4" />
            </button>
          </div>
          <button className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700">
            <Mic className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex h-9 items-center justify-center rounded-full px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 gap-2"
            type="button"
          >
            <Video className="h-4 w-4" />
            <span className="hidden text-sm font-medium sm:inline">Create</span>
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700"
            type="button"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold"
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
            className="absolute inset-0 bg-black/60"
            onClick={closeAndReset}
            aria-label="Close"
            type="button"
          />

          <div className="relative mx-auto mt-16 w-[min(92vw,520px)] rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <h2 id={dialogTitleId} className="text-sm font-semibold">
                Upload video
              </h2>
              <button
                onClick={closeAndReset}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-900"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-4 py-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-300">
                  Video file
                </label>
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-zinc-700 bg-zinc-900/40 px-3 py-3 hover:bg-zinc-900">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">
                      {videoFile ? videoFile.name : "Choose a file"}
                    </div>
                    <div className="text-xs text-zinc-400">
                      MP4, MOV, WebM (mock)
                    </div>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 border border-zinc-800">
                    <Upload className="h-4 w-4" />
                  </div>
                  <input
                    className="hidden"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-300">
                  Name
                </label>
                <input
                  ref={nameInputRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm outline-none placeholder:text-zinc-500 focus:border-zinc-600"
                  placeholder="Video name"
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[96px] w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm outline-none placeholder:text-zinc-500 focus:border-zinc-600"
                  placeholder="Describe your video"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-zinc-800 px-4 py-3">
              <button
                onClick={closeAndReset}
                className="h-9 rounded-full border border-zinc-700 bg-zinc-900 px-4 text-sm font-semibold hover:bg-zinc-800"
                type="button"
              >
                Cancel
              </button>
              <button
                disabled={!canUpload}
                onClick={async () => {
                  const response = await axios.post("http://localhost:3000/upload-sessions", {
                    filename: videoFile?.name ?? "",
                    contentType: videoFile?.type ?? "video/mp4"
                  });
                  const uploadResponse = await axios.put(response.data.upload.url, videoFile, {
                    headers: {
                      "Content-Type": videoFile?.type ?? "video/mp4"
                    }
                  });
                  console.log(uploadResponse.data);
                  const completeResponse = await axios.post(`http://localhost:3000/upload-sessions/${response.data.uploadSessionId}/complete`, {
                    s3Key: response.data.s3Key,
                    etag: uploadResponse.data.etag
                  });
                  console.log(completeResponse.data);
                  closeAndReset();
                }}
                className="h-9 rounded-full bg-zinc-50 px-4 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
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

