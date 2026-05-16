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
    const { uid, phone, name } = req.user!;
    const clerkUser = req.body.clerkUser;
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || req.user!.email;

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

/**
 * GET /auth/me
 * Protected — requires a valid Clerk token.
 * Returns the current authenticated user's profile and role.
 */
export const getMe = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    // If the token decoded correctly, req.user will have the role
    if (!req.user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: req.user.uid },
    });

    if (!user) {
      // In dev environment with fake token, we can mock it
      if (req.user.uid === "temp-clerk-id") {
        res.json({
          success: true,
          data: {
            id: "temp-id",
            role: "ADMIN",
            name: "Admin User",
          },
        });
        return;
      }
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  }
);
