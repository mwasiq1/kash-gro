import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const validatePromo = async (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || subtotal === undefined) {
      return res.status(400).json({
        success: false,
        message: "Code and subtotal are required",
      });
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: "Invalid promo code",
      });
    }

    if (!promo.isActive) {
      return res.status(400).json({
        success: false,
        message: "This promo code is no longer active",
      });
    }

    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "This promo code has expired",
      });
    }

    if (subtotal < promo.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Add items worth ₹${promo.minOrderValue - subtotal} more to use this code`,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        code: promo.code,
        discountAmount: promo.discountAmount,
      },
    });
  } catch (error) {
    console.error("Error validating promo:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
