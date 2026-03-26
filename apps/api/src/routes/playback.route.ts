import { Router } from "express";
import { handleGetPlaybackManifest } from "../controllers/playback.controller";

const router = Router();

router.get("/playback/:videoId/manifest", handleGetPlaybackManifest);

export default router;
