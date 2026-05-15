import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    phone?: string;
    name?: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Placeholder middleware until Clerk is integrated
  req.user = {
    uid: "temp-clerk-id",
  };
  next();
};
