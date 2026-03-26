import { Router } from "express";
import {
  handleCompleteUploadSession,
  handleCreateUploadSession,
  handleGetUploadSession,
} from "../controllers/uploads.controller";

const router = Router();

router.post("/upload-sessions", handleCreateUploadSession);
router.get("/upload-sessions/:uploadSessionId", handleGetUploadSession);
router.post("/upload-sessions/:uploadSessionId/complete", handleCompleteUploadSession);

export default router;
