import { Router } from "express";
import healthRouter from "./health.routes";
import authRouter from "./auth.routes";
import categoriesRouter from "./categories.routes";
import productsRouter from "./products.routes";
import bannersRouter from "./banners.routes";
import orderRouter from "./order.routes";
import promoRouter from "./promo.routes";
import addressRouter from "./address.routes";
import uploadRouter from "./upload.routes";
import adminRouter from "./admin.routes";
import webhookRouter from "./webhook.routes";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/categories", categoriesRouter);
router.use("/products", productsRouter);
router.use("/banners", bannersRouter);
router.use("/orders", orderRouter);
router.use("/promo", promoRouter);
router.use("/addresses", addressRouter);
router.use("/upload", uploadRouter);
router.use("/admin", adminRouter);
router.use("/webhooks", webhookRouter);

export default router;
