import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { syncUser } from "../controllers/auth.controller";

const router = Router();

/**
 * POST /auth/sync
 * Verifies Firebase token and upserts the user in PostgreSQL.
 */
router.post("/sync", authMiddleware as any, syncUser);

export default router;
