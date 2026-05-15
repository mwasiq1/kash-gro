import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../middleware/async.middleware";

const router = Router();
const prisma = new PrismaClient();

// GET /api/products?categoryId=xxx&limit=30&skip=0
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { categoryId, limit = "30", skip = "0" } = req.query;

    const where = categoryId ? { categoryId: String(categoryId) } : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: Number(limit),
        skip: Number(skip),
        include: { category: { select: { id: true, name: true } } },
        orderBy: { createdAt: "asc" },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ success: true, data: products, total });
  })
);

// GET /api/products/:id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: { select: { id: true, name: true } } },
    });
    if (!product) {
      res.status(404).json({ success: false, error: "Product not found", code: "NOT_FOUND" });
      return;
    }
    res.json({ success: true, data: product });
  })
);

export default router;
