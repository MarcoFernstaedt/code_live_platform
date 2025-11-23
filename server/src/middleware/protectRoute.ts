import { requireAuth, getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { AppError } from "../lib/AppError.js";
import { get } from "http";

export const protectRoute = [
  requireAuth(),
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return next(new AppError("Unauthorized", 401));
      }

      const user = await User.findOne({ clerkId: userId });

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      req.user = user;

      return next();
    } catch (err) {
      console.error("Error in auth middleware:", err);
      return next(new AppError("Internal server error", 500));
    }
  },
];
