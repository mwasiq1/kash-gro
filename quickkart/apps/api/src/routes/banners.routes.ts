import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../middleware/async.middleware";

const router = Router();
const prisma = new PrismaClient();

// GET /api/banners
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
    });
    res.json({ success: true, data: banners });
  })
);

export default router;
