import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async route handler and forwards any rejected Promises
 * to Express's next() error handler — eliminating boilerplate try/catch blocks.
 */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
