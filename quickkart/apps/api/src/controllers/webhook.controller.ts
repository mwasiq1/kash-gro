import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import asyncHandler from "../middleware/async.middleware";

const prisma = new PrismaClient();

export const handleClerkWebhook = asyncHandler(async (req: Request, res: Response) => {
  const { type, data } = req.body;

  if (!data || !data.id) {
    res.status(400).json({ success: false, error: "Invalid payload data" });
    return;
  }

  if (type === "user.created" || type === "user.updated") {
    const clerkId = data.id;
    const email = data.email_addresses?.[0]?.email_address;
    const phone = data.phone_numbers?.[0]?.phone_number;
    const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || "KashGro User";

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        ...(email && { email }),
        ...(phone && { phone }),
        ...(name && { name }),
      },
      create: {
        clerkId,
        email: email ?? null,
        phone: phone ?? null,
        name,
        role: email === "admin@kashgro.com" ? Role.ADMIN : Role.USER,
      },
    });

    res.json({ success: true, data: user });
    return;
  }

  res.json({ success: true, message: "Webhook received but not processed" });
});
