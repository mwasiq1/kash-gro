import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { syncUser, getMe } from "../controllers/auth.controller";

const router = Router();

/**
 * POST /auth/sync
 * Verifies Firebase/Clerk token and upserts the user in PostgreSQL.
 */
router.post("/sync", authMiddleware as any, syncUser);

/**
 * GET /auth/me
 * Returns the currently authenticated user's profile and role.
 */
router.get("/me", authMiddleware as any, getMe as any);

export default router;
