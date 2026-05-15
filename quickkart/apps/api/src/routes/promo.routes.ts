import { Router } from "express";
import { validatePromo } from "../controllers/promo.controller";

const router = Router();

router.post("/validate", validatePromo);

export default router;
