import { Router } from "express";
import {
  handleGetVideo,
  handleListVideos,
  handleGetRecommendedVideos,
} from "../controllers/videos.controller";

const router = Router();

router.get("/videos", handleListVideos);
router.get("/videos/:videoId", handleGetVideo);
router.get("/videos/recommended/:excludeVideoId", handleGetRecommendedVideos);

export default router;
