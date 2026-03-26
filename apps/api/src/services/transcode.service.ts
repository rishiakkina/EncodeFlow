export type TranscodeJob = {
  jobId: string;
  state: "UNKNOWN" | "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  attempts: number;
  errorReason: string | null;
};

export function getTranscodeJob(jobId: string): TranscodeJob {
  // TODO: Fetch job state from Redis +/or persist to DB.
  return {
    jobId,
    state: "UNKNOWN",
    attempts: 0,
    errorReason: null,
  };
}

