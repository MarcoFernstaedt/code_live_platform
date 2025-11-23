import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/AppError.js";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const appError = err instanceof AppError ? err : new AppError("Internal server error", 500);

  res.status(appError.statusCode).json({
    success: false,
    message: appError.message,
  });
};