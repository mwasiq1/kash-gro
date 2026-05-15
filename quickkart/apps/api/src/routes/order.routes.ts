import { Router } from "express";
import { createOrder } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Protect the order creation route with authMiddleware
router.post("/", authMiddleware as any, createOrder as any);

export default router;
