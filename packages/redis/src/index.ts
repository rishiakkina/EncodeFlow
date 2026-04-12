import { createClient, type RedisClientType } from "redis";

const STREAM_KEY = "encodeflow:transcode";
const GROUP_NAME = "encodeflow:transcoder";
const CONSUMER_NAME = "encodeflow:transcoder:consumer";
const BLOCK_MS = 5000;
const READ_COUNT = 10;
  
export type TranscodeRequestPayload = {
  videoId: string;
  uploadSessionId: string;
  inputKey: string;
  outputBaseKey: string;
};

export type RedisObject = {
  id: string;
  fields: Record<string, string>
}

export async function redisClient() {
  const client = createClient({ url: process.env.REDIS_URL });
  await client.connect();
  return client;
}



export async function xAddTranscodeRequest(uploadSessionId: string, inputKey: string, outputBaseKey: string): Promise<string> {
  const client = await redisClient();
  const result = await client.xAdd(STREAM_KEY, "*", {
    payload: JSON.stringify({
      uploadSessionId,
      inputKey,
      outputBaseKey,
    }),
  });
  return result;
}


export async function xReadTranscodeRequest(): Promise<RedisObject[]> {
  const client = await redisClient();
  const res = await client.xReadGroup(
    GROUP_NAME,
    CONSUMER_NAME,
    [{ key: STREAM_KEY, id: ">" }],
    { BLOCK: BLOCK_MS, COUNT: READ_COUNT }
  );
  return res as RedisObject[];
}


export async function xAckTranscodeRequest(id: string): Promise<void> {
  const client = await redisClient();
  await client.xAck(STREAM_KEY, GROUP_NAME, id);
}