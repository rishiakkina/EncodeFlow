import { Router } from "express";
import {
  handleCompleteUploadSession,
  handleCreateUploadSession,
} from "../controllers/uploads.controller";

const router = Router();

router.post("/upload-sessions", handleCreateUploadSession);
router.post("/upload-sessions/:uploadSessionId/complete", handleCompleteUploadSession);

export default router;
