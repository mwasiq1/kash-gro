import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import asyncHandler from "../middleware/async.middleware";

const prisma = new PrismaClient();

/**
 * POST /auth/sync
 * Protected — requires a valid Firebase ID token.
 *
 * Upserts the authenticated Firebase user into PostgreSQL.
 * Called by the frontend immediately after any successful Firebase login.
 */
export const syncUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { uid, email, phone, name } = req.user!;

    // Upsert: find by clerkId or create a new record
    const user = await prisma.user.upsert({
      where: { clerkId: uid },
      update: {
        // Keep profile data fresh from Firebase token
        ...(email && { email }),
        ...(phone && { phone }),
        ...(name && { name }),
      },
      create: {
        clerkId: uid,
        email: email ?? null,
        phone: phone ?? null,
        name: name ?? "KashGro User",
      },
    });

    const isNew = user.createdAt.getTime() === user.updatedAt.getTime();

    if (isNew) {
      console.log(`🆕 Created user: ${user.id} (${email ?? phone})`);
    } else {
      console.log(`✅ Found user: ${user.id} (${email ?? phone})`);
    }

    res.status(isNew ? 201 : 200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    });
  }
);
