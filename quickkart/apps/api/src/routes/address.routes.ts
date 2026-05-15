import { Router } from "express";
import { getAddresses, createAddress } from "../controllers/address.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware as any);

router.get("/", getAddresses as any);
router.post("/", createAddress as any);

export default router;
