import { Router } from "express";
import { createOrder, getOrderById, getOrders, cancelOrder } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All order routes are protected
router.use(authMiddleware as any);

router.get("/", getOrders as any);
router.post("/", createOrder as any);
router.get("/:id", getOrderById as any);
router.patch("/:id/cancel", cancelOrder as any);

export default router;
