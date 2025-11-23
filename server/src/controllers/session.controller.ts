import type { Request, Response } from "express";
import { catchAsync } from "../lib/catchAsync.js";
import Session from "../models/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";
import { AppError } from "../lib/AppError.js";

/**
 * POST /api/session/
 * ------------------------------------------------------------
 * Create a new coding session and initialize Stream video + chat
 * infrastructure for the host.
 *
 * Access: Protected (requires protectRoute middleware)
 *
 * Request Body:
 *   - problemTitle: string
 *   - difficulty: "easy" | "medium" | "hard"
 *
 * Behavior:
 *   1. Validates required fields.
 *   2. Creates a session document in MongoDB.
 *   3. Creates (or retrieves) a Stream video call with metadata.
 *   4. Creates a dedicated Stream chat channel for messaging.
 *
 * Response: 201 Created
 * {
 *   message: "Session created",
 *   session: SessionDocument,
 *   callId: string
 * }
 */
export const createSession = catchAsync(async (req: Request, res: Response) => {
  const { problemTitle, difficulty } = req.body;

  if (!problemTitle || !difficulty) {
    throw new AppError("problemTitle and difficulty are required", 400);
  }

  const hostId = req.user?._id;
  const clerkId = req.user?.clerkId;

  if (!hostId || !clerkId) {
    throw new AppError("Unauthorized: missing user context", 401);
  }

  const callId = `session_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;

  const session = await Session.create({
    problemTitle,
    difficulty,
    host: hostId,
    callId,
  });

  await streamClient.video.call("default", callId).getOrCreate({
    data: {
      created_by_id: clerkId,
      custom: {
        problemTitle,
        difficulty,
        sessionId: session._id.toString(),
      },
    },
  });

  const channel = chatClient.channel("messaging", callId, {
    name: `${problemTitle} Session`,
    created_by_id: clerkId,
    members: [clerkId],
  });

  await channel.create();

  return res.status(201).json({
    message: "Session created",
    session,
    callId,
  });
});

export const getActiveSessions = catchAsync(
  async (_req: Request, res: Response) => {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name avatar")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  }
);

export const getRecentSessions = catchAsync(
  async (req: Request, res: Response) => {
    
  }
);

export const getSessionById = catchAsync(
  async (req: Request, res: Response) => {}
);

export const joinSession = catchAsync(
  async (req: Request, res: Response) => {}
);

export const endSession = catchAsync(async (req: Request, res: Response) => {});
