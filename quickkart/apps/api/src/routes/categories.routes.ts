import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../middleware/async.middleware";

const router = Router();
const prisma = new PrismaClient();

// GET /api/categories — all categories
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    });
    res.json({ success: true, data: categories });
  })
);

export default router;
