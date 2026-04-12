import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  GetObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import dotenv from "dotenv";
dotenv.config();

const DEFAULT_PRESIGN_EXPIRES = 3600;

export const s3Client = new S3Client({
  region: process.env.AWS_REGION??'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID??'',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY??'',
  },
});

export type PresignedPutUrlParams = {
  bucket: string;
  key: string;
  contentType: string;
  expiresInSeconds?: number;
};

export async function getCommand(client: S3Client, params: PresignedGetUrlParams): Promise<GetObjectCommand> {
  return new GetObjectCommand({
    Bucket: params.bucket,
    Key: params.key
  });
}


export async function getPresignedPutUrl(
  client: S3Client,
  params: PresignedPutUrlParams,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
    ContentType: params.contentType,
  });

  return getSignedUrl(client, command, {
    expiresIn: params.expiresInSeconds ?? DEFAULT_PRESIGN_EXPIRES,
  });
}

export async function putObject(
  client: S3Client,
  params: {
    bucket: string;
    key: string;
    contentType: string;
    body: File;
  },
): Promise<PutObjectCommandOutput> {
  return client.send(new PutObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
    ContentType: params.contentType,
    Body: params.body,
  }));
}

export type PresignedGetUrlParams = {
  bucket: string;
  key: string;
  expiresInSeconds?: number;
};

export async function getPresignedGetUrl(
  client: S3Client,
  params: PresignedGetUrlParams,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
  });

  return getSignedUrl(client, command);
}

// export type HeadObjectParams = {
//   bucket: string;
//   key: string;
// };

// export async function headObject(
//   client: S3Client,
//   params: HeadObjectParams,
// ): Promise<HeadObjectCommandOutput> {
//   return client.send(
//     new HeadObjectCommand({
//       Bucket: params.bucket,
//       Key: params.key,
//     }),
//   );
// }
