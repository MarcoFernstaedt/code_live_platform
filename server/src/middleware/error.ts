/**
 * errorHandler
 * ------------------------------------------------------------
 * Global Express error-handling middleware.
 *
 * Purpose:
 *  - Catches all errors forwarded with `next(err)` from routes,
 *    controllers, and async wrappers (catchAsync).
 *  - Normalizes unknown errors into a consistent `AppError`
 *    structure so the API always returns a predictable response.
 *  - Prevents the server from leaking stack traces or internal
 *    details in production environments.
 *
 * Behavior:
 *  - If the incoming error is an AppError, its `statusCode`
 *    and message are used directly.
 *  - If it is any other type of error, it's wrapped into a
 *    generic 500 "Internal server error" AppError.
 *  - Sends JSON response:
 *        {
 *          success: false,
 *          message: string
 *        }
 *
 * Usage:
 *  - Should be mounted after all routes:
 *        app.use(errorHandler);
 *
 * Notes:
 *  - This middleware marks the end of the Express pipeline.
 *  - All thrown or rejected errors inside controllers should
 *    be passed here via catchAsync or `next(err)`.
 */
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/AppError.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const appError =
    err instanceof AppError
      ? err
      : new AppError("Internal server error", 500);

  res.status(appError.statusCode).json({
    success: false,
    message: appError.message,
  });
};