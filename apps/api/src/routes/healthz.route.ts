import { Router } from "express";
import { handleHealthz } from "../controllers/healthz.controller";

const router = Router();

router.get("/healthz", handleHealthz);

export default router;
