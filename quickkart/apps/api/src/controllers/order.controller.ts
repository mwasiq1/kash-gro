import { Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { sendOrderNotification } from "../services/telegram.service";

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

    const { addressId, items, totalAmount: clientTotal, promoCode } = req.body;

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
      let subtotal = 0;
      const orderItemsData = items.map((item: any) => {
        const product = productsInDb.find((p) => p.id === item.productId);
        if (!product) throw new Error("INVALID_PRODUCT");

        const price = product.price;
        subtotal += price * item.quantity;

        return {
          productId: product.id,
          quantity: item.quantity,
          price: price,
        };
      });

      let discount = 0;
      if (promoCode) {
        const promo = await tx.promoCode.findUnique({
          where: { code: promoCode.toUpperCase() }
        });
        if (promo && promo.isActive) {
          const now = new Date();
          if (!promo.endDate || promo.endDate > now) {
            if (subtotal >= promo.minOrderAmount) {
              if (promo.discountType === "PERCENTAGE") {
                discount = (subtotal * promo.discountValue) / 100;
                if (promo.maxDiscountAmount) {
                  discount = Math.min(discount, promo.maxDiscountAmount);
                }
              } else if (promo.discountType === "FLAT") {
                discount = promo.discountValue;
              }
            }
          }
        }
      }

      const deliveryFee = (subtotal > 0 && subtotal < 199) ? 25 : 0;
      const finalTotal = Math.max(0, subtotal - discount + deliveryFee);

      // Generate order number: KG-YYYYMMDD-XXXX
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const lastOrderToday = await tx.order.findFirst({
        where: {
          orderNumber: {
            startsWith: `KG-${dateStr}-`,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextSuffix = 1;
      if (lastOrderToday) {
        const parts = lastOrderToday.orderNumber.split("-");
        const lastSuffix = parseInt(parts[2], 10);
        if (!isNaN(lastSuffix)) {
          nextSuffix = lastSuffix + 1;
        }
      }
      const orderNumber = `KG-${dateStr}-${nextSuffix.toString().padStart(4, "0")}`;

      // Create the Order record
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: internalUser.id,
          deliveryAddress: addressString,
          totalAmount: finalTotal,
          status: "PLACED",
          items: {
            create: orderItemsData,
          },
        },
      });

      return { newOrder, selectedAddress, productsInDb, orderItemsData, internalUser, addressString, subtotal, discount, deliveryFee };
    });

    const { newOrder, selectedAddress, productsInDb, orderItemsData, internalUser, addressString, subtotal, discount, deliveryFee } = order;

    // Send Telegram notification (non-blocking)
    sendOrderNotification({
      orderNumber: newOrder.orderNumber,
      customerName: internalUser.name,
      customerPhone: internalUser.phone,
      customerEmail: internalUser.email,
      deliveryAddress: addressString,
      items: orderItemsData.map((item: any) => {
        const product = productsInDb.find((p) => p.id === item.productId);
        return {
          name: product?.name || "Unknown Product",
          quantity: item.quantity,
          price: item.price,
        };
      }),
      totalAmount: newOrder.totalAmount,
      createdAt: newOrder.createdAt,
    });

    res.status(201).json({ 
      success: true, 
      data: { 
        id: newOrder.id, 
        orderNumber: newOrder.orderNumber,
        total: newOrder.totalAmount,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discount: discount,
        status: newOrder.status,
        placedAt: newOrder.createdAt.toISOString(),
        items: orderItemsData.map((item: any) => {
          const product = productsInDb.find((p) => p.id === item.productId);
          return {
            id: item.productId,
            name: product?.name || "Unknown Product",
            price: item.price,
            quantity: item.quantity,
            image: product?.images?.[0] || ""
          };
        }),
        address: {
          label: selectedAddress.label,
          line1: selectedAddress.line1,
          line2: selectedAddress.line2 || "",
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode
        }
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
        error: `Insufficient stock for: ${productName}` 
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
    // Format the response to match OrderDetail
    const addressMatch = order.deliveryAddress.match(/^([^:]+):\s*([^,]+)(?:,\s*([^,]+))?,\s*([^,]+),\s*([^-]+)\s*-\s*(.*)$/);
    
    // Fallback if regex fails (though we constructed it nicely)
    const address = addressMatch ? {
      label: addressMatch[1],
      line1: addressMatch[2],
      line2: addressMatch[3] || "",
      city: addressMatch[4],
      state: addressMatch[5],
      pincode: addressMatch[6]
    } : {
      label: "Delivery Address",
      line1: order.deliveryAddress,
      city: "",
      state: "",
      pincode: ""
    };

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = (subtotal > 0 && subtotal < 199) ? 25 : 0;
    const discount = Math.max(0, subtotal + deliveryFee - order.totalAmount);

    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.totalAmount,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      discount: discount,
      status: order.status,
      placedAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.productId,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.images?.[0] || "",
        unit: item.product.unit || "item"
      })),
      address
    };

    res.status(200).json({ success: true, data: formattedOrder });
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

    const formattedOrders = orders.map(order => {
      // Format the response to match OrderDetail structure expected by frontend
      const addressMatch = order.deliveryAddress.match(/^([^:]+):\s*([^,]+)(?:,\s*([^,]+))?,\s*([^,]+),\s*([^-]+)\s*-\s*(.*)$/);
      
      const address = addressMatch ? {
        label: addressMatch[1],
        line1: addressMatch[2],
        line2: addressMatch[3] || "",
        city: addressMatch[4],
        state: addressMatch[5],
        pincode: addressMatch[6]
      } : {
        label: "Delivery Address",
        line1: order.deliveryAddress,
        city: "",
        state: "",
        pincode: ""
      };

      const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const deliveryFee = (subtotal > 0 && subtotal < 199) ? 25 : 0;
      const discount = Math.max(0, subtotal + deliveryFee - order.totalAmount);

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.totalAmount,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discount: discount,
        status: order.status,
        placedAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.productId,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          image: item.product.images?.[0] || "",
          unit: item.product.unit || "item"
        })),
        address
      };
    });

    res.status(200).json({ success: true, data: formattedOrders });
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
      include: {
        user: true,
        items: true,
      },
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

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const ord = await tx.order.update({
        where: { id },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
          cancelReason: reason || "Cancelled by user",
        },
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return ord;
    });

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};
