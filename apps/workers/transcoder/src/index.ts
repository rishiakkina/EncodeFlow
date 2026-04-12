import { s3Client, getPresignedPutUrl, getCommand } from "@repo/s3";
import { transcodeToHls, type HlsResolution } from "@repo/ffmpeg";
import fs from "fs";


const awsBucketName = process.env.AWS_BUCKET_NAME;
const InputKey = process.env.InputKey;
const resolutions: HlsResolution[] = ["360p", "480p"];


async function main(){
    if(!awsBucketName || !InputKey) {
        console.error("AWS_BUCKET_NAME and AWS_KEY must be set in environment variables");
        return;
    }

    const rawVideoCommand = await getCommand(s3Client, {
        bucket: awsBucketName,
        key: InputKey
    });

    const result = await s3Client.send(rawVideoCommand);

    const originalPath = `raw/${InputKey}`;
    if (result.Body == null) {
        throw new Error("S3 GetObject returned no body");
    }
    const bytes = await result.Body.transformToByteArray();
    fs.writeFileSync(originalPath, bytes);

    for (const resolution of resolutions) {
        await transcodeToHls(originalPath, `transcoded/${InputKey}.${resolution}.m3u8`, resolution).then(() => {
        
        }).catch((error) => {
            console.error(`Error transcoding ${InputKey} to ${resolution}: ${error}`);
        });
    }
}

main();
