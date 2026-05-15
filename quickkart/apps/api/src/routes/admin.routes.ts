import { Router } from "express";
import { requireAdmin, requireClerkAuth } from "../middleware/auth.middleware";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  getAdminOrders,
  updateOrderStatus,
  getInventory,
  updateStock,
  getAnalytics,
} from "../controllers/admin.controller";

const router = Router();

// Secure all admin routes
router.use(requireClerkAuth as any);
router.use(requireAdmin as any);

// Product CRUD routes
router.get("/products", getProducts as any);
router.post("/products", createProduct as any);
router.patch("/products/:id", updateProduct as any);
router.delete("/products/:id", deleteProduct as any);

// Category CRUD routes
router.get("/categories", getCategories as any);
router.post("/categories", createCategory as any);
router.patch("/categories/:id", updateCategory as any);

// Order management routes
router.get("/orders", getAdminOrders as any);
router.patch("/orders/:id", updateOrderStatus as any);

// Inventory routes
router.get("/inventory", getInventory as any);
router.patch("/inventory/:id", updateStock as any);

// Analytics route
router.get("/analytics", getAnalytics as any);

export default router;


