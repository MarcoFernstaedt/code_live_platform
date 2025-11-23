import type { Request, Response } from "express";
import { chatClient } from "../lib/stream.js";
import { catchAsync } from "../lib/catchAsync.js";
import { AppError } from "../lib/AppError.js";

/**
 * @desc    Generate a Stream Chat user token for the authenticated user
 * @route   GET /api/chat/token
 * @access  Protected (requires protectRoute middleware)
 *
 * Successful Response: 200 OK
 * {
 *   token: string,
 *   userId: string,
 *   username: string,
 *   avatar: string
 * }
 */
export const getStreamToken = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user || !user.clerkId) {
    throw new AppError("Unauthorized: missing user context", 401);
  }

  const token = chatClient.createToken(user.clerkId);

  return res.status(200).json({
    token,
    userId: user.clerkId,
    username: user.name,
    avatar: user.avatar ?? "",
  });
});