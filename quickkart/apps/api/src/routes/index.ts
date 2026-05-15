import { Router } from "express";
import healthRouter from "./health.routes";
import authRouter from "./auth.routes";
import categoriesRouter from "./categories.routes";
import productsRouter from "./products.routes";
import bannersRouter from "./banners.routes";
import orderRouter from "./order.routes";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/categories", categoriesRouter);
router.use("/products", productsRouter);
router.use("/banners", bannersRouter);
router.use("/orders", orderRouter);

export default router;
