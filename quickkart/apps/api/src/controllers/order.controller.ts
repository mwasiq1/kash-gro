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

    const { addressId, items, totalAmount: clientTotal } = req.body;

    if (!addressId || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: "Invalid request payload" });
      return;
    }

    // Secure Prisma transaction
    const order = await prisma.$transaction(async (tx) => {
      // Find the internal user ID
      const internalUser = await tx.user.findUnique({
        where: { clerkId },
        include: { addresses: true },
      });

      if (!internalUser) {
        throw new Error("USER_NOT_FOUND");
      }

      const selectedAddress = internalUser.addresses.find(a => a.id === addressId);
      if (!selectedAddress) {
        throw new Error("ADDRESS_NOT_FOUND");
      }

      const addressString = `${selectedAddress.label}: ${selectedAddress.line1}${selectedAddress.line2 ? ", " + selectedAddress.line2 : ""}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`;

      // Query Product table for all productIds to fetch their current DB prices and stock
      const productIds = items.map((item: any) => item.productId);
      const productsInDb = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (productsInDb.length !== productIds.length) {
        throw new Error("INVALID_PRODUCT");
      }

      // Verify stock and decrement
      for (const item of items) {
        const product = productsInDb.find((p) => p.id === item.productId);
        if (!product) throw new Error("INVALID_PRODUCT");

        if (product.stock < item.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${product.name}`);
        }

        // Decrement stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Calculate totalAmount server-side
      let totalAmount = 0;
      const orderItemsData = items.map((item: any) => {
        const product = productsInDb.find((p) => p.id === item.productId);
        if (!product) throw new Error("INVALID_PRODUCT");

        const price = product.price;
        totalAmount += price * item.quantity;

        return {
          productId: product.id,
          quantity: item.quantity,
          price: price,
        };
      });

      // Generate order number: KG-YYYYMMDD-XXXX
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const orderCountToday = await tx.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      });
      const orderNumber = `KG-${dateStr}-${(orderCountToday + 1).toString().padStart(4, "0")}`;

      // Create the Order record
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: internalUser.id,
          deliveryAddress: addressString,
          totalAmount: totalAmount, // We should probably include delivery fees here if applicable, but for now using items total
          status: "PLACED",
          items: {
            create: orderItemsData,
          },
        },
      });

      return newOrder;
    });

    res.status(201).json({ 
      success: true, 
      data: { 
        id: order.id, 
        orderNumber: order.orderNumber 
      } 
    });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      res.status(404).json({ success: false, error: "User not found in database" });
      return;
    }
    if (error.message === "ADDRESS_NOT_FOUND") {
      res.status(404).json({ success: false, error: "Address not found" });
      return;
    }
    if (error.message === "INVALID_PRODUCT") {
      res.status(400).json({ success: false, error: "One or more products not found" });
      return;
    }
    if (error.message.startsWith("INSUFFICIENT_STOCK")) {
      const productName = error.message.split(":")[1];
      res.status(400).json({ 
        success: false, 
        error: "INSUFFICIENT_STOCK", 
        message: `Insufficient stock for ${productName}` 
      });
      return;
    }
    next(error);
  }
};

export const getOrderById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const clerkId = req.user?.uid;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    // Security check: only the owner or an admin can view the order
    if (order.user.clerkId !== clerkId) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
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

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const clerkId = req.user?.uid;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!order) {
      res.status(404).json({ success: false, error: "Order not found" });
      return;
    }

    if (order.user.clerkId !== clerkId) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    if (order.status !== "PLACED") {
      res.status(400).json({
        success: false,
        error: "Cannot cancel order that is already being processed or delivered",
      });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancelReason: reason || "Cancelled by user",
      },
    });

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};
