import { Router } from "express";
import {
  handleGetVideo,
  handleGetVideoStatus,
  handleListVideos,
} from "../controllers/videos.controller";

const router = Router();

router.get("/videos", handleListVideos);
router.get("/videos/:videoId", handleGetVideo);
router.get("/videos/:videoId/status", handleGetVideoStatus);

export default router;
