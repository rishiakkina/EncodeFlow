import { Router } from "express";
import { handleGetTranscodeJob } from "../controllers/transcode.controller";

const router = Router();

router.get("/transcode-jobs/:jobId", handleGetTranscodeJob);

export default router;
