import { s3Client, getCommand, PutObjectCommand } from "@repo/s3";
import { transcodeToHls, type HlsResolution } from "@repo/ffmpeg";
import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();
const awsRegion = process.env.AWS_REGION?.trim();
const BucketName = process.env.BucketName?.trim();
const inputKey = process.env.INPUT_KEY?.trim();
const outputBaseKey = process.env.OUTPUT_BASE_KEY?.trim();
const resolutions: HlsResolution[] = ["360p", "480p"];

const variantBandwidth: Record<HlsResolution, number> = {
  "360p": 800000,
  "480p": 1400000,
};

const variantDimensions: Record<HlsResolution, string> = {
  "360p": "640x360",
  "480p": "854x480",
};

function buildMasterPlaylist(variants: HlsResolution[]): string {
  const lines = ["#EXTM3U", "#EXT-X-VERSION:3"];

  for (const resolution of variants) {
    lines.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${variantBandwidth[resolution]},RESOLUTION=${variantDimensions[resolution]}`,
    );
    lines.push(`${resolution}/index.m3u8`);
  }

  return `${lines.join("\n")}\n`;
}

async function listFiles(rootDir: string): Promise<string[]> {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(rootDir, entry.name);
      if (entry.isDirectory()) {
        return listFiles(fullPath);
      }
      return [fullPath];
    }),
  );

  return files.flat();
}

function getContentType(filePath: string): string {
  if (filePath.endsWith(".m3u8")) {
    return "application/vnd.apple.mpegurl";
  }
  if (filePath.endsWith(".ts")) {
    return "video/mp2t";
  }
  return "application/octet-stream";
}

async function uploadDirectoryToS3(localDir: string, bucket: string, baseKey: string): Promise<void> {
  const files = await listFiles(localDir);

  for (const filePath of files) {
    const relativePath = path.relative(localDir, filePath).split(path.sep).join("/");
    const key = `${baseKey}/${relativePath}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: createReadStream(filePath),
        ContentType: getContentType(filePath),
      }),
    );
  }
}

async function main(): Promise<void> {
  if (!BucketName || !inputKey) {
    throw new Error("BucketName and INPUT_KEY must be set in environment variables");
  }

  const safeKey = inputKey.replace(/[\\/]/g, "_");
  const runDir = path.join(process.cwd(), "transcoder-work", safeKey);
  const inputFilePath = path.join(runDir, "input.mp4");
  const hlsOutputDir = path.join(runDir, "hls");
  const targetOutputBaseKey = outputBaseKey ?? `videos/${path.parse(path.basename(inputKey)).name}`;

  await fs.rm(runDir, { recursive: true, force: true });
  await fs.mkdir(hlsOutputDir, { recursive: true });

  try {
    const rawVideoCommand = await getCommand(s3Client, {
      bucket: BucketName,
      key: inputKey,
    });

    const result = await s3Client.send(rawVideoCommand);
    if (!result.Body) {
      throw new Error("S3 GetObject returned no body");
    }

    const bytes = await result.Body.transformToByteArray();
    await fs.writeFile(inputFilePath, bytes);

    for (const resolution of resolutions) {
      const outputPlaylistPath = path.join(hlsOutputDir, resolution, "index.m3u8");
      await transcodeToHls(inputFilePath, outputPlaylistPath, resolution);
    }

    const masterPlaylistPath = path.join(hlsOutputDir, "master.m3u8");
    await fs.writeFile(masterPlaylistPath, buildMasterPlaylist(resolutions), "utf8");

    await uploadDirectoryToS3(hlsOutputDir, BucketName, targetOutputBaseKey);
    console.log("Transcode and upload complete", {
      inputKey,
      outputBaseKey: targetOutputBaseKey,
    });
  } finally {
    await fs.rm(runDir, { recursive: true, force: true });
  }
}

main()
  .then(() => {
    console.log("Success");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Transcoder failed", error);
    process.exit(1);
  });
