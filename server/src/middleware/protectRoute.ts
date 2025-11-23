/**
 * protectRoute Middleware
 * ------------------------------------------------------------
 * Purpose:
 *   Ensures that the incoming request is authenticated through Clerk
 *   and that the authenticated Clerk user exists in our internal DB.
 *
 * How it works:
 *  1. `requireAuth()` (Clerk middleware) verifies the session + token.
 *  2. `getAuth(req)` extracts the authenticated Clerk userId.
 *  3. Finds the matching User document in MongoDB using clerkId.
 *  4. Attaches the full User object to `req.user` for downstream use.
 *  5. If missing, invalid, or not found → throws AppError.
 *
 * Use cases:
 *   - Protecting all private API routes
 *   - Ensuring DB identity is synced with Clerk identity
 *   - Making user info available for controllers (req.user)
 *
 * Error Handling:
 *   - 401 → missing/invalid Clerk auth
 *   - 404 → Clerk user exists but no DB record
 *   - 500 → unexpected internal error
 */
import { requireAuth, getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { AppError } from "../lib/AppError.js";

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