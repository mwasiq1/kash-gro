import { Request, Response, NextFunction } from "express";
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();
export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    phone?: string;
    name?: string;
    role?: string;
  };
  file?: Express.Multer.File;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}
export const requireClerkAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) {
      res.status(401).json({ success: false, error: "Invalid token" });
      return;
    }
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
    if (!payload.sub) {
      res.status(401).json({ success: false, error: "Invalid token payload" });
      return;
    }
    const email = payload.email || payload.email_address || undefined;
    const name = payload.name || payload.full_name || undefined;
    const user = await prisma.user.upsert({
      where: { clerkId: payload.sub },
      update: {},
      create: {
        clerkId: payload.sub,
        email,
        name,
        role: email === "admin@kashgro.com" ? Role.ADMIN : Role.USER,
      },
    });
    req.user = { uid: user.clerkId!, email: user.email ?? undefined, role: user.role };
    return next();
  } catch (err) {
    console.error("[Auth] Token decode / upsert error:", err);
    res.status(401).json({ success: false, error: "Authentication failed" });
    return;
  }
};
export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user || req.user.role !== "ADMIN") {
    res.status(403).json({ success: false, error: "Forbidden: Admins only" });
    return;
  }
  next();
};
export const authMiddleware = requireClerkAuth;
