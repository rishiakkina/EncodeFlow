import { Router } from "express";
import healthzRouter from "./healthz.route";
import uploadsRouter from "./uploads.route";
import videosRouter from "./videos.route";
import transcodeJobsRouter from "./transcode.route";
import playbackRouter from "./playback.route";

const router = Router();

// Each sub-router defines its own absolute paths (no additional mounting prefix).
router.use(healthzRouter);
router.use(uploadsRouter);
router.use(videosRouter);
router.use(transcodeJobsRouter);
router.use(playbackRouter);

export default router;
