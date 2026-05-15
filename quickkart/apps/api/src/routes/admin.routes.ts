import { Router } from "express";
import { requireAdmin, requireClerkAuth } from "../middleware/auth.middleware";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
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

export default router;
