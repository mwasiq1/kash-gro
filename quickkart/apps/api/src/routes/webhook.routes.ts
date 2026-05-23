import { Router } from "express";
import { handleClerkWebhook } from "../controllers/webhook.controller";

const router = Router();

router.post("/clerk", handleClerkWebhook as any);

export default router;
