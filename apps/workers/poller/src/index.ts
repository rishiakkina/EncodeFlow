import { xAckTranscodeRequest, xReadTranscodeRequest, type TranscodeRequestPayload } from "@repo/redis";
import { ECSClient, RunTaskCommand, RunTaskCommandOutput } from "@aws-sdk/client-ecs";

const awsRegion = process.env.AWS_REGION;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const ecsCluster = process.env.ECS_CLUSTER;
const ecsTaskDef = process.env.ECS_TASK_DEF;
const subnets = process.env.SUBNETS?.split(",");
const securityGroups = process.env.SECURITY_GROUP?.split(",");
const containerName = process.env.CONTAINER_NAME;

if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey || !containerName) {
  throw new Error("ENVIRONMENT must be set");
}


const ecsClient = new ECSClient({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

if (!ecsCluster || !ecsTaskDef || !subnets || !securityGroups) {
  throw new Error("ECS_CLUSTER, ECS_TASK_DEF, SUBNETS, and SECURITY_GROUP must be set");
}

type FargateTaskOverrides = {
  environment: {
    UploadSessionId: string;
    InputKey: string;
    OutputBaseKey: string;
  };
};

export async function runFargateTask(overrides: FargateTaskOverrides): Promise<RunTaskCommandOutput> {
    const command = new RunTaskCommand({
      cluster: ecsCluster,
      taskDefinition: ecsTaskDef,
      launchType: "FARGATE",
  
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: subnets,
          securityGroups: securityGroups,
          assignPublicIp: "ENABLED",
        },
      },
  
      overrides: {
        containerOverrides: [
          {
            name: containerName,
            environment: [
              { name: "UploadSessionId", value: overrides.environment.UploadSessionId },
              { name: "InputKey", value: overrides.environment.InputKey },
              { name: "OutputBaseKey", value: overrides.environment.OutputBaseKey },
            ],
          },
        ],
      },
    });
  
    const response = await ecsClient.send(command);
    return response;
}


async function main(): Promise<void> {
  while (true) {
    try {
      const res = await xReadTranscodeRequest();

      if (!res) continue;

      for (const entry of res) {
        for (const [key, value] of Object.entries(entry.fields)) {
          const payload = JSON.parse(value) as TranscodeRequestPayload;
          if (!payload) {
            console.warn(`Poller skipped invalid payload for message ${key} on stream ${entry.id}`);
            continue;
          }

          const response = await runFargateTask({
            environment: {
              UploadSessionId: payload.uploadSessionId,
              InputKey: payload.inputKey,
              OutputBaseKey: payload.outputBaseKey,
            },
          });
          console.log("Poller event", {
            stream: entry.id,
            messageId: key,
            UploadSessionId: payload.uploadSessionId,
            InputKey: payload.inputKey,
            OutputBaseKey: payload.outputBaseKey,
          });

          console.log("Fargate task response", response);

          await xAckTranscodeRequest(key);
        }
      }
    } catch (error) {
      console.error("Poller read loop error", error);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

main().catch((error) => {
  console.error("Poller fatal startup error", error);
  process.exit(1);
});