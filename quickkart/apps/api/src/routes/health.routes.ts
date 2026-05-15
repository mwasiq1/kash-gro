import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../middleware/async.middleware";

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /health
 * Returns API and database status.
 */
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    // Lightweight query to verify the DB connection is alive
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  })
);

export default router;
