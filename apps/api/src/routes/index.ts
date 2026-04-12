import { Router } from "express";
import uploadsRouter from "./uploads.route";
import videosRouter from "./videos.route";

const router = Router();

// Each sub-router defines its own absolute paths (no additional mounting prefix).
router.use(uploadsRouter);
router.use(videosRouter);

export default router;
