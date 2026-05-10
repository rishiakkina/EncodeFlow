import path from "node:path";
import fs from "node:fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static"

if (!ffmpegPath) {
  throw new Error("ffmpeg-static could not resolve an ffmpeg binary.");
}
ffmpeg.setFfmpegPath(ffmpegPath)

const resolutions = {
    "360p": {
        bitrate: "500k",
        height: "360",
    },
    "480p": {
        bitrate: "1000k",
        height: "480",
    },
} as const;

export type HlsResolution = keyof typeof resolutions;
export function transcodeToHls(
    inputVideo: string,
    outputVideo: string,
    resolution: HlsResolution,
): Promise<void> {
    const outputDir = path.dirname(outputVideo);
    fs.mkdirSync(outputDir, { recursive: true });
    const segmentPattern = path.join(outputDir, "segment_%03d.ts");

    return new Promise<void>((resolve, reject) => {
        ffmpeg(inputVideo)
            .videoCodec("libx264")
            .audioCodec("aac")
            .format("hls")
            .size(`?x${resolutions[resolution].height}`)
            .outputOptions([
                "-preset veryfast",
                "-g 48",
                "-sc_threshold 0",
        
                "-hls_time 6",
                "-hls_playlist_type vod",
                "-hls_list_size 0",
        
                `-hls_segment_filename ${segmentPattern}`
              ])
            .videoBitrate(resolutions[resolution].bitrate)
            .output(outputVideo)
            .on("end",async () => resolve())
            .on("error", (err) => reject(err))
            .run();
    });
}

