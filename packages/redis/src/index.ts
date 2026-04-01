import { createClient, type RedisClientType } from "redis";

const TRANSCODE_REQUEST_STREAM = "encodeflow:transcode";

const TRANSCODE_REQUEST_CONSUMER_GROUP_360p = "encodeflow:360p:consumer";
const TRANSCODE_REQUEST_CONSUMER_GROUP_720p = "encodeflow:720p:consumer";
const TRANSCODE_REQUEST_CONSUMER_GROUP_480p = "encodeflow:480p:consumer";

export type TranscodeRequestPayload = {
  jobId: string;
  videoId: string;
  uploadSessionId: string;
  inputKey: string;
  outputBaseKey: string;
  qualities: ["1080p", "720p", "480p"];
  attempt: number;
  maxAttempts: number;
  priority: number;
  traceId?: string;
  createdAtMs: number;
};

export async function redisClient() {
  const client = createClient({ url: process.env.REDIS_URL });
  await client.connect();
  return client;
}



export async function xAddTranscodeRequest(payload: TranscodeRequestPayload): Promise<string> {
  const client = await redisClient();
  const result = await client.xAdd(TRANSCODE_REQUEST_STREAM, "*", {
    payload: JSON.stringify(payload),
  });
  return result;
}

