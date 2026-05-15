import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import asyncHandler from "../middleware/async.middleware";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  mrp: z.number().positive(),
  sellingPrice: z.number().positive(),
  unit: z.string().min(1, "Unit is required"),
  imageUrl: z.string().url("Valid image URL is required"),
  categoryId: z.string().min(1, "Category is required"),
  stock: z.number().int().min(0).default(10),
  lowStockAt: z.number().int().min(0).default(5),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
});

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

/**
 * GET /admin/products
 * Fetch products with pagination and search
 */
export const getProducts = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const categoryId = req.query.categoryId as string;
    const status = req.query.status as string; // 'active' or 'inactive'

    const skip = (page - 1) * limit;

    const where: any = {
      name: { contains: search, mode: "insensitive" },
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }
);

/**
 * POST /admin/products
 * Create a new product
 */
export const createProduct = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const validatedData = productSchema.parse(req.body);

    const slug = validatedData.slug || generateSlug(validatedData.name);

    // Ensure slug uniqueness
    const existingSlug = await prisma.product.findFirst({ where: { slug } });
    if (existingSlug) {
      res.status(400).json({ success: false, error: "Slug already exists" });
      return;
    }

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        slug,
      },
    });

    res.status(201).json({ success: true, data: product });
  }
);

/**
 * PATCH /admin/products/:id
 * Update an existing product
 */
export const updateProduct = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const validatedData = productSchema.partial().parse(req.body);

    if (validatedData.slug) {
      const existingSlug = await prisma.product.findFirst({
        where: { slug: validatedData.slug, id: { not: id } },
      });
      if (existingSlug) {
        res.status(400).json({ success: false, error: "Slug already exists" });
        return;
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
    });

    res.json({ success: true, data: product });
  }
);

/**
 * DELETE /admin/products/:id
 * Soft delete a product
 */
export const deleteProduct = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ success: true, data: product });
  }
);
