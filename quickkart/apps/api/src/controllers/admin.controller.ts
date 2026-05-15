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

const normalizeProduct = (product: any) => ({
  ...product,
  price: product.sellingPrice,
  images: [product.imageUrl],
});

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
      data: products.map(normalizeProduct),
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

    res.status(201).json({ success: true, data: normalizeProduct(product) });
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

    res.json({ success: true, data: normalizeProduct(product) });
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

    res.json({ success: true, data: normalizeProduct(product) });
  }
);

// ─── Category Handlers ────────────────────────────────────────────────────────

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  imageUrl: z.string().url("Valid image URL is required").optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

/**
 * GET /admin/categories
 * Fetch all categories sorted by sortOrder, with a product count per category.
 */
export const getCategories = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.json({ success: true, data: categories });
  }
);

/**
 * POST /admin/categories
 * Create a new category.
 */
export const createCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const validatedData = categorySchema.parse(req.body);

    const slug = validatedData.slug || generateSlug(validatedData.name);

    const existingSlug = await prisma.category.findFirst({ where: { slug } });
    if (existingSlug) {
      res.status(400).json({ success: false, error: "A category with that slug already exists" });
      return;
    }

    const category = await prisma.category.create({
      data: { ...validatedData, slug },
    });

    res.status(201).json({ success: true, data: category });
  }
);

/**
 * PATCH /admin/categories/:id
 * Update an existing category.
 */
export const updateCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const validatedData = categorySchema.partial().parse(req.body);

    if (validatedData.slug) {
      const existingSlug = await prisma.category.findFirst({
        where: { slug: validatedData.slug, id: { not: id } },
      });
      if (existingSlug) {
        res.status(400).json({ success: false, error: "A category with that slug already exists" });
        return;
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
    });

    res.json({ success: true, data: category });
  }
);

// ─── Admin Order Handlers ─────────────────────────────────────────────────────

const ORDER_STATUSES = ["PENDING", "PLACED", "PROCESSING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"] as const;
type OrderStatusType = typeof ORDER_STATUSES[number];

const STATUS_TIMESTAMP_MAP: Partial<Record<OrderStatusType, string>> = {
  PROCESSING: "processingAt",
  OUT_FOR_DELIVERY: "outForDeliveryAt",
  DELIVERED: "deliveredAt",
  CANCELLED: "cancelledAt",
};

/**
 * GET /admin/orders
 * List all orders with filtering by status, date range, and search (orderNumber | user.name).
 */
export const getAdminOrders = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string) || "";
    const status = req.query.status as string;
    const dateFrom = req.query.dateFrom as string;
    const dateTo = req.query.dateTo as string;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && ORDER_STATUSES.includes(status as OrderStatusType)) {
      where.status = status;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          items: {
            include: {
              product: {
                select: { id: true, name: true, imageUrl: true, unit: true },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }
);

/**
 * PATCH /admin/orders/:id
 * Update an order's fulfillment status and set the corresponding timestamp.
 */
export const updateOrderStatus = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !ORDER_STATUSES.includes(status as OrderStatusType)) {
      res.status(400).json({ success: false, error: "Invalid order status" });
      return;
    }

    const timestampField = STATUS_TIMESTAMP_MAP[status as OrderStatusType];

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(timestampField ? { [timestampField]: new Date() } : {}),
        // Special case: PROCESSING also sets confirmedAt if not already set
        ...(status === "PROCESSING"
          ? {
              confirmedAt: undefined, // Preserve existing value via upsert logic below
            }
          : {}),
      },
    });

    // If moving to PROCESSING and confirmedAt is null, back-fill it
    if (status === "PROCESSING" && !order.confirmedAt) {
      await prisma.order.update({
        where: { id },
        data: { confirmedAt: new Date() },
      });
    }

    res.json({ success: true, data: order });
  }
);

// ─── Inventory Handlers ───────────────────────────────────────────────────────

/**
 * GET /admin/inventory
 * Fetch all products returning id, name, category, stock, lowStockAt, and status.
 */
export const getInventory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: {
          select: {
            name: true,
          },
        },
        stock: true,
        lowStockAt: true,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json({ success: true, data: products });
  }
);

/**
 * PATCH /admin/inventory/:id
 * Update the stock count of a specific product.
 */
export const updateStock = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { stock } = req.body;

    if (typeof stock !== "number" || stock < 0) {
      res.status(400).json({ success: false, error: "Invalid stock value" });
      return;
    }

    const product = await prisma.product.update({
      where: { id },
      data: { stock },
    });

    res.json({ success: true, data: product });
  }
);

// ─── Analytics Handlers ───────────────────────────────────────────────────────

/**
 * GET /admin/analytics
 * Aggregate store data for the dashboard.
 */
export const getAnalytics = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // 1. Today's Stats
    const todayStats = await prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfToday },
        status: { not: "CANCELLED" },
      },
      _count: { id: true },
      _sum: { totalAmount: true },
      _avg: { totalAmount: true },
    });

    const newCustomersToday = await prisma.user.count({
      where: { createdAt: { gte: startOfToday } },
    });

    // 2. Last 7 Days Revenue & Orders
    const last7DaysData = await Promise.all(
      Array.from({ length: 7 }).map(async (_, i) => {
        const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        const stats = await prisma.order.aggregate({
          where: {
            createdAt: { gte: dayStart, lte: dayEnd },
            status: { not: "CANCELLED" },
          },
          _count: { id: true },
          _sum: { totalAmount: true },
        });

        return {
          label: date.toLocaleDateString("en-US", { weekday: "short" }),
          date: dayStart.toISOString(),
          revenue: stats._sum.totalAmount || 0,
          orders: stats._count.id || 0,
        };
      })
    );

    // 3. Orders By Status
    const ordersByStatusRaw = await prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const ordersByStatus = ordersByStatusRaw.map((item) => ({
      status: item.status,
      count: item._count.id,
    }));

    // 4. Top Products (by units sold and revenue)
    // We'll join OrderItem and Product
    const topProductsRaw = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const topProducts = await Promise.all(
      topProductsRaw.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, imageUrl: true, unit: true },
        });
        return {
          id: item.productId,
          name: product?.name || "Unknown",
          imageUrl: product?.imageUrl,
          unit: product?.unit,
          unitsSold: item._sum.quantity || 0,
          revenue: item._sum.price || 0,
        };
      })
    );

    // 5. Low Stock Alert
    const lowStock = await prisma.product.findMany({
      where: {
        stock: { lte: prisma.product.fields.lowStockAt },
        isActive: true,
      },
      select: { id: true, name: true, stock: true, lowStockAt: true },
      orderBy: { stock: "asc" },
      take: 5,
    });

    res.json({
      success: true,
      data: {
        today: {
          orders: todayStats._count.id,
          revenue: todayStats._sum.totalAmount || 0,
          avgOrderValue: todayStats._avg.totalAmount || 0,
          newCustomers: newCustomersToday,
        },
        last7Days: last7DaysData,
        ordersByStatus,
        topProducts,
        lowStock,
      },
    });
  }
);
