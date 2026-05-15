import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Catch-all 404 handler — mount AFTER all valid routes.
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error: AppError = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = "NOT_FOUND";
  next(error);
};

/**
 * Global error handler — mount as the very last middleware.
 * Returns a standardised error envelope for every uncaught error.
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const statusCode = err.statusCode ?? 500;
  const code = err.code ?? "INTERNAL_SERVER_ERROR";

  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${statusCode} ${code}:`, err.message);
    if (err.stack) console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: err.message || "An unexpected error occurred",
    code,
  });
};
