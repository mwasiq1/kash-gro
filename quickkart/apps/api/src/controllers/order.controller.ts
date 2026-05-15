import { Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clerkId = req.user?.uid;
    if (!clerkId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const { address, items } = req.body;

    if (!address || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: "Invalid request payload" });
      return;
    }

    // Secure Prisma transaction
    const order = await prisma.$transaction(async (tx) => {
      // Find the internal user ID
      const internalUser = await tx.user.findUnique({
        where: { clerkId },
      });

      if (!internalUser) {
        throw new Error("USER_NOT_FOUND");
      }

      // Query Product table for all productIds to fetch their current DB prices
      const productIds = items.map((item: any) => item.productId);
      const productsInDb = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (productsInDb.length !== productIds.length) {
        throw new Error("INVALID_PRODUCT");
      }

      // Calculate totalAmount server-side
      let totalAmount = 0;
      const orderItemsData = items.map((item: any) => {
        const product = productsInDb.find((p) => p.id === item.productId);
        if (!product) throw new Error("INVALID_PRODUCT");

        const price = product.sellingPrice;
        totalAmount += price * item.quantity;

        return {
          productId: product.id,
          quantity: item.quantity,
          price: price,
        };
      });

      // Create the Order record
      const newOrder = await tx.order.create({
        data: {
          userId: internalUser.id,
          deliveryAddress: address,
          totalAmount: totalAmount,
          status: "PENDING",
          items: {
            create: orderItemsData,
          },
        },
      });

      return newOrder;
    });

    res.status(201).json({ success: true, orderId: order.id });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      res.status(404).json({ success: false, error: "User not found in database" });
      return;
    }
    if (error.message === "INVALID_PRODUCT") {
      res.status(400).json({ success: false, error: "One or more products not found" });
      return;
    }
    next(error);
  }
};
