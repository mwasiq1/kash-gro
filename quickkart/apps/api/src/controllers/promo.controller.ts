import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const validatePromo = async (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || subtotal === undefined) {
      return res.status(400).json({
        success: false,
        error: "Code and subtotal are required",
      });
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo) {
      return res.status(404).json({
        success: false,
        error: "Invalid promo code",
      });
    }

    if (!promo.isActive) {
      return res.status(400).json({
        success: false,
        error: "This promo code is no longer active",
      });
    }

    if (promo.endDate && new Date(promo.endDate) < new Date()) {
      return res.status(400).json({
        success: false,
        error: "This promo code has expired",
      });
    }

    if (subtotal < promo.minOrderAmount) {
      return res.status(400).json({
        success: false,
        error: `Add items worth ₹${promo.minOrderAmount - subtotal} more to use this code`,
      });
    }

    const discountAmount = promo.discountType === "PERCENTAGE"
      ? Math.min((promo.discountValue / 100) * subtotal, promo.maxDiscountAmount || Infinity)
      : promo.discountValue;

    return res.status(200).json({
      success: true,
      data: {
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        maxDiscountAmount: promo.maxDiscountAmount,
        discount: discountAmount,
      },
    });
  } catch (error) {
    console.error("Error validating promo:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
