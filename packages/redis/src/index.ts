import { createClient, type RedisClientType } from "redis";

const STREAM_KEY = "encodeflow:transcode";
const GROUP_NAME = "encodeflow:transcoder";
const CONSUMER_NAME = "encodeflow:transcoder:consumer";
const BLOCK_MS = 5000;
const READ_COUNT = 10;
  
export type TranscodeRequestPayload = {
  videoId: string;
  BucketName: string;
  inputKey: string;
  OutputBaseKey: string;
};

export type RedisObject = {
  id: string;
  fields: Record<string, string>
}

export async function redisClient() {
  const client = createClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' });
  await client.connect();
  return client;
}

export async function initializeRedis(): Promise<RedisClientType> {
  const client = await redisClient() as RedisClientType;
  if (!client) {
    throw new Error("Redis client not initialized");
  }
  try {
    await client.xGroupCreate(STREAM_KEY, GROUP_NAME, "$", { MKSTREAM: true });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("BUSYGROUP")) {
      throw error;
    }
  }
  return client;
}

  export async function xAddTranscodeRequest(videoId: string, BucketName: string, inputKey: string, OutputBaseKey: string): Promise<string> {
  const client = await redisClient();
  const result = await client.xAdd(STREAM_KEY, "*", {
    payload: JSON.stringify({
      videoId,
      BucketName,
      inputKey,
      OutputBaseKey,
    }),
  });
  return result;
}


export async function xReadTranscodeRequest(redisClient: RedisClientType): Promise<RedisObject[]> {
  const res = await redisClient.xReadGroup(
    GROUP_NAME,
    CONSUMER_NAME,
    [{ key: STREAM_KEY, id: ">" }],
    { BLOCK: BLOCK_MS, COUNT: READ_COUNT }
  );
  if (!res) {
    return [];
  }

  return res.flatMap((stream) =>
    stream.messages.map((entry) => ({
      id: entry.id,
      fields: entry.message,
    }))
  );
}


export async function xAckTranscodeRequest(redisClient: RedisClientType, id: string): Promise<void> {
  await redisClient.xAck(STREAM_KEY, GROUP_NAME, id);
}
